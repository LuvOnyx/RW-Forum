import Home from './pages/Home.jsx';
import Apply from './pages/Apply.jsx';
import Discussions from './pages/Discussions.jsx';
import Post from './pages/Post.jsx';
import Rules from './pages/Rules.jsx';
import Announcements from './pages/Announcements.jsx';
import Support from './pages/Support.jsx';
import Profile from './pages/Profile.jsx';
import ModLog from './pages/ModLog.jsx';
import EditProfile from './pages/EditProfile.jsx';

export const PAGES = {
  home: Home,
  apply: Apply,
  discussions: Discussions,
  post: Post,
  rules: Rules,
  announcements: Announcements,
  support: Support,
  profile: Profile,
  modlog: ModLog,
  "edit-profile": EditProfile,
};

export const pagesConfig = {
  Pages: PAGES,
  mainPage: "home",
};
