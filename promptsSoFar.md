I got this project from figma, and would like to initialized this project that will fit next.js ssr style of project. This is due to the fact that we will be talking to and manipulating data with supabase and will have content management system imbue to the project.


----


The buttons lead to these links

Apple: `https://podcasts.apple.com/us/podcast/back-n-body-hurts/id1722381103`
Spotify: `https://open.spotify.com/show/7Evzpy1MHgZR8Yy9xDuxXY?trackId=4sMR8fuTzbUyzB0asxifV0`
Youtube `https://www.youtube.com/@BnBHurtsPodcast/featured`

click to open a new page

---

So the RSS feeds we have received, we have linebreaks under <item><description> however when the data reaches the front end, the linebreak disappears. needs fixing


---

Create another panel, edit and create hosts that will be used to display on the front end. Some task to enable

1. Create entry that has
- Name
- Profile Photo
- Interest
- Description
- Entry for social media array list

2. Admin users are allowed to edit, add, and remove said entries

3. On the client end `/about` is to read this list and display it in a 2x2 grid of these host based on the entries


----

For Contacts Client, we need to be able to make alterations to the entries of it. Some task to work on

1. For the actions column, only have view and delete feature. By clicking any part of the row, opens the popup to view, and before deleting. It needs to have a confirmation popup.
2. All new entry comes in has status `new` from `/contact`
3. When user clicks on popup to view, update the node & db with `email` of the logged in user, switch `new` to `reviewed`. If it is already in any other status, do not need to update.
3. On the popup, have an extra row to change the status, it should be a dropdown and also a small text to show reviewed by: display the email
4. When the user changes the status dropdown, change the node and db and update the reviewed_by with the user who changed it
5. The call to action buttons should be removed, and just add an `X` button to close the popup


----


For the task page, I would like to do a trello kanban board. We are migrating the data from there as referenced in `kanbanboard.json`. Setup a db and connect users to the board.


---

We need to change things around the task board, to make it more flushed and user friendly. 

1. We need to destructure the file, to have components to manage it easier, when we start putting in more nodes as features.
2. The nodes can be a little bit smaller with reduing text size, and change the user to a Circle with Initials, and the due date needs to have an icon, and with the date approaching relative to today. it will display how many days left.
3. Right now there is a drag and drop feature but there is not a click feature to view and be able to edit the task and comments


---

We have two types of episodes, one regular, and the other `STS` the `STS` episodes are denoted by `STS*` where the `*` is a number.

So for `/episodes` we would like to have a filter to switch between `STS` or regular episodes or both 

---


I acquired a discord webhook, so when any anon users submit any `contact`, `guest-submission` or `sponsorship` needs to inform our discord when the submission went through. The webhook link is linked in `.env.local` as `DISCORD_INQUIRIES_WEBHOOK` 



----

Now that we have a discord webhook. I would like to hook all the actions within `/admin/task` that includes:

- Edits
- New task
- Moving task

Let me know what else did I miss


----


Use your front end skills and design principal to modernized the home page, and use those elements on all the other pages within (public) files for the consumer eyes for a Electronic Dance Music Podcast. The page transition needs to be animated along side with buttons. 


---

Use your front end skills and design principal to modernized the admin pages, and use those elements on all the other pages within (admin) files for the consumer eyes for a content management system. 

---

Use frontend-design, web-design-guidelines and tailwind skills to give the kanban board a nice modern look.

Also when user clicks on `Add-Task` at the bottom, instead of popping up a small summarized popup at the bottom. Use the right drawer slider instead for users to input details on it


---

For the Kanban task board. Need a few more task to be implemented:

1. Admins are able to add, remove, and rename columns.
2. Task that is under `Done` needs to be archived after 30 days. Soft delete, just not visible in the front end but have it still in database, we will need to add in an extra column table in the database
3. Have an elipsis option on the task to have the functionality to move the task to whichever column its needed with a dropdown.
4. When dragging and dropping the task, it can't go beyond the screen when trying to drag it to the edge of the board.


----

I would like to create another page listing under workspace, for a calendar using the guidelines of the skills we have installed including, frontend-design, web-design-guidelines, and tailwind

1. have a page that displays a calendar that will have the ability of
   1. Able to navigate different months and years
   2. The week starts with Monday to Sunday
   3. The box is big enough to view details within
2. Would like to implement a new API from `https://edmtrain.com/api-documentation`
   1. I will provide api key in `EDMTRAIN_API_KEY`
   2. I would like to do a CRON job on a weekly basis to be saved in a new database table, have an array slot to fit hosts
   3. In the APi docs, we need to provide any changes to the Events that are updated
3. These events are linked to calendar provided


----


Calendar has been designed, are some tweaks and feature changes to it.

1. When there are more than 3 events in calendar, I can't view the rest but it only views the one directly under it
2. The host name assign is obtained from the hosts table can be listed as a dropdown
3. For the task board column `Events` would like to have custom functionality to it that we can just search and pick the event from calendar to be imported, and when hosts are assign it needs to be reflected


----

I would like to create a routing error page or a 404 using the guidelines of the skills we have installed including, frontend-design, web-design-guidelines, and tailwind

----

I would like to connect the `hosts` to link with user data that is signed in, so that the calender and tasks will connect to the said host to do. When creating a host, it is a mandatory requirement to link a host to an account. this value is immutable, and put yikern as `host`

And add a role category, under the category `hosts` for user to choose between `team` or `host`. So we can create different type of experience further down the line.

and in the front end `/public/about` will only display users that have `host`

In Calendar, we can link the host to the event, but with the implementation to join these hosts to real users created, everything will be linked.

---

Now using node v20.19.6 (npm v10.8.2)

save this as memory to do a build check on it rather than older versions