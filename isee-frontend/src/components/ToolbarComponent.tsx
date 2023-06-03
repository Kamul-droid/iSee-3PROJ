import React, { FormEvent } from 'react';
import getUser from '../helpers/getUser';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchbarComponent';
import endpoints from '../api/endpoints';
import { EUserRole } from '../enums/EUserRole';

export function Toolbar() {
  const user = getUser();
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const search = e.target.search.value;

    navigate(`/search/${search}`);
  };

  return (
    <div className="flex my-5 px-5 py-3 bg-gradient-to-r from-cyan-200 to-green-200 border-white border-2 rounded-lg ">
      <Link to={'/'} className="p-2">
        Isee
      </Link>

      <SearchBar handleSubmit={handleSubmit} className="flex-grow flex justify-center" />

      {user && (
        <Link to="/videos/upload" className="p-2">
          Upload a video
        </Link>
      )}

      <div className="group relative">
        <div className="flex items-center">
          <p className="px-2">Welcome {user?.username || 'guest'}</p>
          <img
            src={`${endpoints.apiBase}profile-pictures/${user?.avatar || 'default-avatar.jpg'}`}
            alt=""
            className={`rounded-full bg-white w-10 h-10 shadow-md bg-clip-content object-cover text-xs overflow-clip`}
          ></img>
        </div>
        <div className="hidden group-hover:block absolute top-full w-full pt-2 z-20">
          <div className="bg-white rounded-lg shadow-md flex flex-col">
            {user ? (
              <>
                <Link to={`/users/${user._id}/videos`} className="text-center p-2 hover:bg-slate-100 rounded-t-lg">
                  My videos
                </Link>
                <Link to={'/profile'} className="text-center p-2 hover:bg-slate-100">
                  Edit profile
                </Link>
                {user.role === EUserRole.ADMIN && (
                  <Link to={'/admin/dashboard'} className="text-center p-2 hover:bg-slate-100">
                    Admin dashboard
                  </Link>
                )}
                <button
                  className="items-center p-2 hover:bg-slate-100 rounded-b-lg"
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
                <Link to="/login" className="text-center p-2 rounded-t-lg hover:bg-slate-100">
                  Login
                </Link>
                <Link to="/register" className="text-center p-2 rounded-b-lg hover:bg-slate-100">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
