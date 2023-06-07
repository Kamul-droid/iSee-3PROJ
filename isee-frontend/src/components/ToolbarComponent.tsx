import React from 'react';
import getUser from '../helpers/getUser';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchbarComponent';
import endpoints from '../api/endpoints';
import { EUserRole } from '../enums/EUserRole';
import { MdUpload } from 'react-icons/md';
import TooltipComponent from './TooltipComponent';

export function Toolbar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const search = e.target.search.value;

    navigate(`/search/${search}`);
  };

  return (
    <div className="flex mb-5 px-5 py-3 bg-gradient-to-r from-cyan-200 to-green-200 shadow-lg justify-between items-center ">
      <Link to={'/'} className="font-bold text-xl">
        Isee
      </Link>

      <SearchBar
        handleSubmit={handleSubmit}
        className="flex-grow flex justify-center min-w-0 shrink max-w-3xl h-full"
      />

      <div className="flex items-center">
        {user && (
          <TooltipComponent text="Upload a new video">
            <Link to="/videos/upload">
              <MdUpload size={25} />
            </Link>
          </TooltipComponent>
        )}

        <div className="group relative ml-2">
          <div className="flex items-center justify-end">
            <div className="flex items-center ml-2">
              <p>{user?.username || 'guest'}</p>
              <img
                src={`${endpoints.apiBase}profile-pictures/${user?.avatar || 'default-avatar.jpg'}`}
                alt=""
                className={`rounded-full mx-2 bg-white w-10 h-10 shadow-md bg-clip-content object-cover text-xs overflow-clip`}
              ></img>
            </div>
          </div>
          <div className="scale-y-0 group-hover:scale-y-100 transition-transform absolute top-full w-full pt-2 z-20 min-w-max right-0">
            <div className="bg-slate-900/70 rounded-lg shadow-md flex flex-col p-3">
              {user ? (
                <>
                  <Link
                    to={`/users/${user._id}`}
                    className="rounded-lg bg-white p-2 text-center hover:bg-slate-100 my-2"
                  >
                    My videos
                  </Link>
                  <Link to={'/profile'} className="rounded-lg bg-white p-2 text-center hover:bg-slate-100 my-2">
                    Edit profile
                  </Link>
                  {user.role === EUserRole.ADMIN && (
                    <Link
                      to={'/admin/dashboard'}
                      className="rounded-lg bg-white p-2 text-center hover:bg-slate-100 my-2"
                    >
                      Admin dashboard
                    </Link>
                  )}
                  <button
                    className="rounded-lg bg-white p-2 text-center hover:bg-slate-100 my-2"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-lg bg-white p-2 text-center hover:bg-slate-100 my-2">
                    Login
                  </Link>
                  <Link to="/register" className="rounded-lg bg-white p-2 text-center hover:bg-slate-100 my-2">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
