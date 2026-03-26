"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Task, KanbanColumn } from "@/types";
import { sendDiscordNotification } from "@/lib/discord";

export async function updateTaskColumn(id: string, columnId: string) {
	const supabase = await createClient();
	const [{ data: task }, { data: column }] = await Promise.all([
		supabase.from("tasks").select("title").eq("id", id).single(),
		supabase.from("kanban_columns").select("name").eq("id", columnId).single(),
	]);
	const isDone = column?.name === "Done";
	await supabase
		.from("tasks")
		.update({ column_id: columnId, done_at: isDone ? new Date().toISOString() : null })
		.eq("id", id);
	revalidatePath("/admin/tasks");
	await sendDiscordNotification(
		`🔀 **Task Moved**\n**Task:** ${task?.title ?? id}\n**To column:** ${column?.name ?? columnId}\n`,
		"task",
	);
}

export async function createTask(data: {
	title: string;
	description: string;
	column_id: string;
	priority: string;
	assignee_names?: string[];
	assignee_ids?: string[];
	due_date?: string;
	label_color?: string;
	event_id?: string;
}) {
	const supabase = await createClient();
	const { data: column } = await supabase
		.from("kanban_columns")
		.select("name")
		.eq("id", data.column_id)
		.single();
	await supabase.from("tasks").insert({
		title: data.title,
		description: data.description,
		column_id: data.column_id,
		priority: data.priority,
		assignee_names: data.assignee_names ?? [],
		assignee_ids: data.assignee_ids ?? [],
		due_date: data.due_date ?? null,
		label_color: data.label_color ?? null,
		event_id: data.event_id ?? null,
		tags: [],
		sort_order: 0,
	});
	revalidatePath("/admin/tasks");
	const assigneeStr = data.assignee_names?.join(", ");
	const lines = [
		`📋 **Task Created**`,
		`**Title:** ${data.title}`,
		`**Priority:** ${data.priority}`,
		`**Column:** ${column?.name ?? data.column_id}`,
		...(assigneeStr ? [`**Assignees:** ${assigneeStr}`] : []),
		...(data.due_date ? [`**Due:** ${data.due_date}`] : []),
	];
	await sendDiscordNotification(lines.join("\n"), "task");
}

export async function updateTask(
	id: string,
	data: Partial<
		Pick<
			Task,
			| "title"
			| "description"
			| "priority"
			| "assignee_names"
			| "assignee_ids"
			| "due_date"
			| "label_color"
			| "column_id"
			| "tags"
		>
	>,
) {
	const supabase = await createClient();
	const { data: existing } = await supabase
		.from("tasks")
		.select("title")
		.eq("id", id)
		.single();
	await supabase.from("tasks").update(data).eq("id", id);
	revalidatePath("/admin/tasks");
	const changed = Object.keys(data).join(", ");
	await sendDiscordNotification(
		`✏️ **Task Updated**\n**Task:** ${existing?.title ?? id}\n**Fields changed:** ${changed}\n`,
		"task",
	);
}

export async function deleteTask(id: string) {
	const supabase = await createClient();
	const { data: task } = await supabase
		.from("tasks")
		.select("title")
		.eq("id", id)
		.single();
	await supabase.from("tasks").delete().eq("id", id);
	revalidatePath("/admin/tasks");
	await sendDiscordNotification(
		`🗑️ **Task Deleted**\n**Title:** ${task?.title ?? id}\n`,
		"task",
	);
}

export async function archiveDoneTasks(): Promise<{ archivedCount: number }> {
	const supabase = await createClient();
	const { data: doneColumn } = await supabase
		.from("kanban_columns")
		.select("id")
		.eq("name", "Done")
		.single();
	if (!doneColumn) return { archivedCount: 0 };
	const cutoff = new Date();
	cutoff.setDate(cutoff.getDate() - 7);
	const { data: archived } = await supabase
		.from("tasks")
		.update({ archived_at: new Date().toISOString() })
		.eq("column_id", doneColumn.id)
		.lt("done_at", cutoff.toISOString())
		.not("done_at", "is", null)
		.is("archived_at", null)
		.select("id");
	revalidatePath("/admin/tasks");
	return { archivedCount: archived?.length ?? 0 };
}

export async function createColumn(data: {
	name: string;
	color: string;
	sort_order: number;
}): Promise<{ id?: string; error?: string }> {
	const supabase = await createClient();
	const { data: col, error } = await supabase
		.from("kanban_columns")
		.insert({ name: data.name, color: data.color, sort_order: data.sort_order })
		.select("id")
		.single();
	if (error) return { error: error.message };
	revalidatePath("/admin/tasks");
	await sendDiscordNotification(
		`🗂️ **Column Created**\n**Name:** ${data.name}\n`,
		"task",
	);
	return { id: col.id };
}

export async function updateColumn(
	id: string,
	data: Partial<Pick<KanbanColumn, "name" | "color" | "sort_order">>,
): Promise<{ error?: string }> {
	const supabase = await createClient();
	const { error } = await supabase
		.from("kanban_columns")
		.update(data)
		.eq("id", id);
	if (error) return { error: error.message };
	revalidatePath("/admin/tasks");
	return {};
}

export async function deleteColumn(id: string): Promise<{ error?: string }> {
	const supabase = await createClient();
	const { error } = await supabase.from("kanban_columns").delete().eq("id", id);
	if (error) {
		if (error.code === "23503") {
			return { error: "Column has tasks. Move or delete them first." };
		}
		return { error: error.message };
	}
	revalidatePath("/admin/tasks");
	await sendDiscordNotification(
		`🗑️ **Column Deleted**\n**ID:** ${id}\n`,
		"task",
	);
	return {};
}
