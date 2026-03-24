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

---

I would like to create a section here with accented background colors to show the audience where the host will be going in the next 2 weeks of events that can be found in `Columns.Events`, only display events that have host attending. Use the skills we have to design a section that will satisfy the following:

1. It needs to have a powered by EDMTRAIN and have a link to go to their site as their policy
2. Users can see the events and can click to open up a popup to see more details and have a link to EDMTRAIN
3. it needs to return a circular image of the host that are attending

You will need to update some db policies where anon can read that event column and task within.


---

Can we add more filters for the episode, theres ` 'all' | 'regular' | 'sts' ` I would like to add timestamp asc and desc


---

This file needs rework, there has been feedback that the player is not centered enough, but I will list out the task to be done, use the skills (frontend-design, tailwind-design-system, web-design-guidelines) to guide :

1. Player needs to be centered
2. Right now the seek icon is not right, that is the next episode icon
3. Have the ability to play go to the next episode, or the previous episode. the arrow needs to be dynamic to know if it is the first episode to not display the previous episode and the last episode to not display the next episode.
4. The clicking on the title of the episode should take you to the episode page
5. Mobile is not displaying which episode is being played
6. Have a close button to remove the player
7. On mobile, it needs to have buffer for the player, it is too close to action features on phones

----

I need a password reset page, I am using supabase password reset link to rest.
Use the guideline skill to help design the page


----

I would like to create a component here to show `highlightedEpisode` where it will be one video with 16:9 ratio, can be configured through the CMS on page `/admin/content` Make a separate tab here to change the view and have an input that will accept a youtube link. have a save button, and this needs to be remembered by the database so that we can retrieve it from the front end. 

Have a preview video in the CMS as well so that we will know which video is being displayed.


----

On the Admin left list add a section under management to be Affiliated links. We will need to extend the database to accept.

So for the inputs of the affiliated links will require (mandatory unless explicit instruction)
- Name
- Description
- Image
- Type [link or code]
- Input for said type
- Expiration date (optional)

On the front end side, place a new section if theres any affiliated links, use front end design skills to create a component if theres any affiliated link to display, in a grid form. Place said component inbetween EventGoingSection and SubscribeSection


----


So far we are struggling with trying to keep up social media posting that we have, so under workspace section, we would like to create another section to post social media. label as `Social Media`, The social media platforms I would like are Youtube, Instagram, and Tiktok.

There are a few things I would like to achieve with these proposition:
- I would like to add in description, video or photo or multi post
- Ability to schedule, and reflect on the calendar with red bg for nodes as the first entry of the array
- It needs to be a step by step solution, from choosing type, to uploading, to filling up post settings
- If there are different configurations for each of the platform I would like to have a way to fill them up individually
- Set which platform to post but by default would be all three
- Once we post, we will then delete the uploaded picture/video as it will take up space but save the description content in history

These are the things I can think off right off my head we will add on as we go along

----

Since we want to post from our webapp, we need to create a demo login system to showcase the functionality and for them to approve, we have locked it down with youtube but for Tiktok and Instagram and Threads. 

Tiktok request a demo to be approved:
For example, it should demonstrate how you use TikTok for Developers' capabilities, such as Login Kit, Share Kit, Display API, Content Posting API, and the relevant scopes.
If your app has not been approved before, you are required to use a sandbox environment on the Developer Portal to demonstrate the integration.
The demo video should showcase the website or app where the features will actually be integrated.
All selected products and scopes must be clearly demonstrated in the video. If you don't need certain products or scopes, make sure to remove them before review. Otherwise, it will delay the review result.
The video should clearly show the user interface and user interactions.
If you intend to integrate with a web app, make sure the domain of the website shown in the demo video matches the website URL you provide.
If you intend to integrate with a mobile app, the demo video should start by showing the app being opened.

Facebook requests a demo:
Provide instructions for accessing the app so we may complete our review.
Explain how to navigate to the app, and provide instructions for testing.

In your response, please include confirmation of any use of Meta APIs or integrations pertaining to Facebook Login. If you are no longer using Facebook Login please tell us why and share general instructions for testing. We may reach out to you for more information.

Meta APIs refer to endpoints such as email, public profile, user permissions (user_friends, user_gender, user_birthday, etc). For some apps, this is called advanced access.


I have placed the callback url to be `/admin/social-media/{type}-redirect` where type can be `youtube` `tiktok` and `meta` on their respective platforms




----

I would like to create a terms and conditions page, and also a privacy policy page. Make it standard that will be compliant with meta and tiktok for content posting.

Users are not allowed to create an account with our website as they are only for internal users which we will manually create account. Once we have a shop up, then we will allow users to create account and delete them.

Details and content will not be saved as we are not managing social media content for other people but our own podcast content.


----


So for the taskboard, it is very robust. I would like it to be a little bit real time. so when users are logged in to view this task board. when there is update on one user, it will be reflected for other users


----

So for submissions, we have started receiving a lot of spam. Is there a way to prevent it?


----

In the Kanban Board, for column 'Done' has a soft delete after 1 week of placing in the done column.

- Users are allowed to bring content back out from the done column to any other column
- When users place task into done, mark it with a date that is 1 week expiry to do a soft delete
- Mark all current done to have a expiry date of today and then remove them after 1 week
- Show the contents inside done where it is not soft deleted

----

We would like to do Show reviews for the shows that we have attended in the event sheet.

So for the past shows


-----
