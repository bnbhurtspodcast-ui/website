export interface Episode {
  id: number;
  title: string;
  description: string;
  duration: string;
  date: string;
  audioUrl: string;
  imageUrl: string;
  category: string;
}

export const episodes: Episode[] = [
  {
    id: 1,
    title: "The Future of AI and Human Creativity",
    description: "Join us as we explore how artificial intelligence is reshaping creative industries and what it means for human artists, writers, and creators. We discuss the balance between AI assistance and human ingenuity.",
    duration: "45:32",
    date: "2026-02-08",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1709846485906-30b28e7ed651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwc3R1ZGlvJTIwbWljcm9waG9uZXxlbnwxfHx8fDE3NzA3NjI0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Technology"
  },
  {
    id: 2,
    title: "Building Resilience in Uncertain Times",
    description: "A deep dive into mental health, resilience, and strategies for navigating life's challenges. Our guest psychologist shares practical techniques for building emotional strength.",
    duration: "52:18",
    date: "2026-02-01",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1707670489413-30382f265e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwcmVjb3JkaW5nJTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzA3MDMyNzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Wellness"
  },
  {
    id: 3,
    title: "The Science of Sleep",
    description: "Why do we sleep? What happens when we don't get enough? Sleep scientist Dr. Sarah Chen explains the latest research on sleep cycles, dreams, and how to optimize your rest.",
    duration: "38:45",
    date: "2026-01-25",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1709846485906-30b28e7ed651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwc3R1ZGlvJTIwbWljcm9waG9uZXxlbnwxfHx8fDE3NzA3NjI0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Science"
  },
  {
    id: 4,
    title: "Entrepreneurship 101: From Idea to Launch",
    description: "Serial entrepreneur Mark Thompson shares his journey from a simple idea to a multi-million dollar business. Learn about the pitfalls to avoid and the strategies that work.",
    duration: "61:22",
    date: "2026-01-18",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1707670489413-30382f265e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwcmVjb3JkaW5nJTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzA3MDMyNzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Business"
  },
  {
    id: 5,
    title: "Climate Change: What Can We Do?",
    description: "Environmental activist and author Lisa Green discusses practical steps individuals and communities can take to combat climate change. It's not too late to make a difference.",
    duration: "47:15",
    date: "2026-01-11",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1709846485906-30b28e7ed651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwc3R1ZGlvJTIwbWljcm9waG9uZXxlbnwxfHx8fDE3NzA3NjI0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Environment"
  },
  {
    id: 6,
    title: "The Art of Storytelling",
    description: "Award-winning filmmaker and storyteller shares insights on crafting compelling narratives that resonate with audiences. From structure to emotion, we cover it all.",
    duration: "55:40",
    date: "2026-01-04",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1707670489413-30382f265e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2RjYXN0JTIwcmVjb3JkaW5nJTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzA3MDMyNzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Arts"
  }
];

export const categories = ["All", "Technology", "Wellness", "Science", "Business", "Environment", "Arts"];
