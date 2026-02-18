import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Home } from "./pages/Home";
import { Episodes } from "./pages/Episodes";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { GuestSubmission } from "./pages/GuestSubmission";
import { Sponsorship } from "./pages/Sponsorship";
import { PressKit } from "./pages/PressKit";
import { SignIn } from "./pages/SignIn";
import { Overview } from "./pages/admin/Overview";
import { TaskBoard } from "./pages/admin/TaskBoard";
import { Contacts } from "./pages/admin/Contacts";
import { Guests } from "./pages/admin/Guests";
import { Sponsorships } from "./pages/admin/Sponsorships";
import { Content } from "./pages/admin/Content";
import { Settings } from "./pages/admin/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "episodes", Component: Episodes },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "guest-submission", Component: GuestSubmission },
      { path: "sponsorship", Component: Sponsorship },
      { path: "press-kit", Component: PressKit },
      { path: "admin/signin", Component: SignIn },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { path: "dashboard", Component: Overview },
      { path: "tasks", Component: TaskBoard },
      { path: "contacts", Component: Contacts },
      { path: "guests", Component: Guests },
      { path: "sponsorships", Component: Sponsorships },
      { path: "content", Component: Content },
      { path: "settings", Component: Settings },
    ],
  },
]);