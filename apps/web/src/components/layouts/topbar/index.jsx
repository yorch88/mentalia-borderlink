import ArabianFlag from '@/assets/images/flags/arebian.svg';
import FrenchFlag from '@/assets/images/flags/french.jpg';
import GermanyFlag from '@/assets/images/flags/germany.jpg';
import ItalyFlag from '@/assets/images/flags/italy.jpg';
import JapaneseFlag from '@/assets/images/flags/japanese.svg';
import RussiaFlag from '@/assets/images/flags/russia.jpg';
import SpainFlag from '@/assets/images/flags/spain.jpg';
import UsFlag from '@/assets/images/flags/us.jpg';

import avatar1 from '@/assets/images/user/avatar-1.png';
import avatar3 from '@/assets/images/user/avatar-3.png';
import avatar5 from '@/assets/images/user/avatar-5.png';
import avatar7 from '@/assets/images/user/avatar-7.png';

import { Link, useNavigate } from 'react-router-dom';
import { TbSearch } from 'react-icons/tb';
import { logout } from './api';

import SimpleBar from 'simplebar-react';
import SidenavToggle from './SidenavToggle';
import ThemeModeToggle from './ThemeModeToggle';

import {
  LuBellRing,
  LuClock,
  LuGem,
  LuHeart,
  LuLogOut,
  LuMail,
  LuMessagesSquare,
  LuMoveRight,
  LuSettings,
  LuShoppingBag
} from 'react-icons/lu';

/* =========================
   STATIC DATA
========================= */

const languages = [
  { src: UsFlag, label: 'English' },
  { src: SpainFlag, label: 'Spanish' },
  { src: GermanyFlag, label: 'German' },
  { src: FrenchFlag, label: 'French' },
  { src: JapaneseFlag, label: 'Japanese' },
  { src: ItalyFlag, label: 'Italian' },
  { src: RussiaFlag, label: 'Russian' },
  { src: ArabianFlag, label: 'Arabic' }
];

const tabs = [
  { id: 'tabsViewall', title: 'View all', active: true },
  { id: 'tabsMentions', title: 'Mentions' },
  { id: 'tabsFollowers', title: 'Followers' },
  { id: 'tabsInvites', title: 'Invites' }
];

const notifications = {
  tabsViewall: [
    {
      type: 'follow',
      avatar: avatar3,
      text: <><b>@willie_passem</b> followed you</>,
      time: 'Wednesday 03:42 PM',
      ago: '4 sec'
    },
    {
      type: 'comment',
      avatar: avatar5,
      text: <><b>@caroline_jessica</b> commented on your post</>,
      time: 'Wednesday 03:42 PM',
      ago: '15 min',
      comment: 'Amazing! Fast, professional and great to work with!'
    }
  ]
};

/* =========================
   COMPONENT
========================= */

const Topbar = () => {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }

    localStorage.removeItem("access_token");
    navigate("/basic-login");
  };

  const profileMenu = [
    {
      icon: <LuMail className="size-4" />,
      label: 'Inbox',
      to: '/mailbox',
      badge: '15'
    },
    {
      icon: <LuMessagesSquare className="size-4" />,
      label: 'Chat',
      to: '/chat'
    },
    {
      icon: <LuGem className="size-4" />,
      label: 'Upgrade Pro',
      to: '/pricing'
    },
    { divider: true },
    {
      icon: <LuLogOut className="size-4" />,
      label: 'Sign Out',
      onClick: handleLogout
    }
  ];

  return (
    <div className="app-header min-h-topbar-height flex items-center sticky top-0 z-30 bg-(--topbar-background) border-b border-default-200">
      <div className="w-full flex items-center justify-between px-6">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-5">
          <SidenavToggle />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          <ThemeModeToggle />

          {/* USER MENU */}
          <div className="topbar-item hs-dropdown relative inline-flex">
            <button className="cursor-pointer bg-pink-100 rounded-full">
              <img
                src={avatar1}
                alt="user"
                className="hs-dropdown-toggle rounded-full size-9.5"
              />
            </button>

            <div className="hs-dropdown-menu min-w-48">
              <div className="p-2">
                <h6 className="mb-2 text-default-500">Welcome</h6>
                <div className="flex gap-3">
                  <img src={avatar1} alt="user" className="size-12 rounded" />
                  <div>
                    <h6 className="mb-1 text-sm font-semibold text-default-800">
                      Paula Keenan
                    </h6>
                    <p className="text-default-500">CEO & Founder</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-default-200 -mx-2 my-2"></div>

              <div className="flex flex-col gap-y-1">

                {profileMenu.map((item, i) =>
                  item.divider ? (
                    <div key={i} className="border-t border-default-200 -mx-2 my-1"></div>
                  ) : item.onClick ? (
                    <button
                      key={i}
                      onClick={item.onClick}
                      className="flex items-center gap-x-3.5 py-1.5 px-3 text-default-600 hover:bg-default-150 rounded font-medium w-full text-left"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      key={i}
                      to={item.to}
                      className="flex items-center gap-x-3.5 py-1.5 px-3 text-default-600 hover:bg-default-150 rounded font-medium"
                    >
                      {item.icon}
                      {item.label}
                      {item.badge && (
                        <span className="size-4.5 font-semibold bg-danger rounded text-white flex items-center justify-center text-xs">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Topbar;