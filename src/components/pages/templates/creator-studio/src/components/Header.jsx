import React, { useState, useEffect } from 'react';
import { Home, Undo2, Redo2, User, Download, Menu, LogOut, Save, FileText } from 'lucide-react';
import { supabase } from '../../../../../../utils/supabaseClient';

// Update props to include onLogout, onUpdateTemplate, showUpdateButton and currentTemplateName
const Header = ({ 
  onToggleSidebar, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo, 
  onExportTemplate, 
  onUpdateTemplate,
  showUpdateButton,
  currentTemplateName,
  onLogout,
  onNewDesign
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data?.user) {
          console.error("Authentication error:", error);
          setLoading(false);
          return;
        }
        
        // Fetch user profile from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('avatar_url, full_name')
          .eq('id', data.user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Profile fetch error:", profileError);
        }
        
        setUser({
          ...data.user,
          avatar_url: profile?.avatar_url || null,
          full_name: profile?.full_name || data.user.user_metadata?.display_name || null
        });
      } catch (err) {
        console.error("User fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  const toggleMenu = () => setShowMenu(prev => !prev);

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-700 text-gray-200 shadow-md flex-shrink-0 relative z-50">
      <div className="mx-auto max-w-full px-2 sm:px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Left Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Hamburger Menu Button (Visible on < lg screens) */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white lg:hidden"
              aria-controls="sidebar"
              aria-expanded="false"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Home Button */}
            <a
              href="/dashboard"
              title="Back to Dashboard"
              className="hidden sm:inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <Home className="h-6 w-6" aria-hidden="true" />
            </a>

            {/* New Design Button */}
            <button
              type="button"
              title="New Design"
              onClick={onNewDesign}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <FileText className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">New Design</span>
            </button>

            {/* Undo Button */}
            <button
              type="button"
              title="Undo"
              disabled={!canUndo}
              onClick={onUndo}
              className="inline-flex items-center justify-center rounded-full p-2 text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Undo last action"
            >
              <Undo2 className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Redo Button */}
            <button
              type="button"
              title="Redo"
              disabled={!canRedo}
              onClick={onRedo}
              className="inline-flex items-center justify-center rounded-full p-2 text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Redo last action"
            >
              <Redo2 className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Center - Template Name (if editing) */}
          {showUpdateButton && currentTemplateName && (
            <div className="hidden md:flex items-center">
              <span className="text-sm font-medium text-gray-300">
                Editing: {currentTemplateName}
              </span>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {/* Update Template Button - only shown when editing an existing template */}
            {showUpdateButton && (
              <button
                type="button"
                onClick={onUpdateTemplate}
                title={`Update "${currentTemplateName}"`}
                className="relative inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-2 sm:px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              >
                <Save className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                <span className="hidden sm:inline">Update Template</span>
                <span className="sm:hidden">Update</span>
              </button>
            )}
            
            {/* Export Button */}
            <button
              type="button"
              onClick={onExportTemplate}
              className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-2 sm:px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <Download className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">Export as Template</span>
              <span className="sm:hidden">Export</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="relative inline-flex items-center gap-x-1.5 rounded-md bg-red-500 px-2 sm:px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
              title="Logout"
            >
              <LogOut className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Profile Circle */}
            <div className="relative">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 hover:bg-gray-600 overflow-hidden"
                id="user-menu-button"
                aria-expanded={showMenu}
                aria-haspopup="true"
                title={user?.full_name || user?.email || "User options"}
                onClick={toggleMenu}
              >
                <span className="sr-only">Open user menu</span>
                {loading ? (
                  <div className="animate-pulse h-full w-full bg-gray-300"></div>
                ) : user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt="User avatar" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </button>

              {/* User dropdown menu */}
              {showMenu && (
                <div 
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" 
                  role="menu" 
                  aria-orientation="vertical" 
                  aria-labelledby="user-menu-button" 
                  tabIndex="-1"
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user?.full_name || "User"}</p>
                    <p className="text-xs truncate">{user?.email}</p>
                  </div>
                  <a 
                    href="/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    role="menuitem"
                  >
                    Dashboard
                  </a>
                  <button 
                    onClick={onLogout} 
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" 
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;