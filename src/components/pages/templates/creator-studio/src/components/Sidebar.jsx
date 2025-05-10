import React from 'react';
import { LayoutDashboard, Shapes, Type, Replace, Settings } from 'lucide-react';

const menuItems = [
  { name: 'Designs', icon: LayoutDashboard, key: 'Designs' }, // Use unique keys
  { name: 'Elements', icon: Shapes, key: 'Elements' },
  { name: 'Text', icon: Type, key: 'Text' },
  { name: 'Placeholders', icon: Replace, key: 'Placeholders' },
  { name: 'Properties', icon: Settings, key: 'Properties' },
];

// Accept new props: activeSubMenu, setActiveSubMenu
const Sidebar = ({ isOpen, activeSubMenu, setActiveSubMenu }) => {
  // Determine collapsed state (only relevant on large screens)
  const isCollapsed = activeSubMenu !== null;

  const handleMenuClick = (key, event) => {
    // Prevent default link behavior if using <a> tags
    event.preventDefault();
    // If the clicked menu is already active, close it, otherwise activate it
    setActiveSubMenu(prev => prev === key ? null : key);
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40
        h-screen bg-white shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:inset-auto lg:z-auto lg:h-auto
        lg:translate-x-0 lg:flex-shrink-0
        lg:border-r lg:border-gray-200
        transition-width duration-300 ease-in-out // Add transition for width change
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'} // Dynamic width on large screens
      `}
      aria-label="Main Sidebar"
    >
      {/* Adjusted padding based on collapsed state for large screens */}
      <div className={`flex h-full flex-col overflow-y-auto overflow-x-hidden ${isCollapsed ? 'lg:px-2' : 'lg:px-3'} py-4`}>

        {/* Optional: Sidebar Header/Logo - Hide when collapsed */}
        <div className={`mb-4 flex h-16 items-center justify-center border-b border-gray-200 lg:hidden ${isCollapsed ? 'lg:invisible' : ''}`}>
             <span className="text-xl font-semibold text-gray-700">Menu</span>
        </div>
         {/* Optional: Placeholder for logo on large screens, hidden when collapsed */}
         <div className={`hidden lg:flex h-16 items-center ${isCollapsed ? 'justify-center' : 'px-4'} mb-4 border-b border-gray-200`}>
             {/* Replace with your logo/icon */}
             <span className={`font-bold text-xl ${isCollapsed ? 'hidden' : 'inline'}`}>CEYINVOICE</span>
             <span className={`font-bold text-xl ${isCollapsed ? 'inline' : 'hidden'}`}>CEY</span> {/* Collapsed initial */}
         </div>


        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => (
            <li key={item.key}>
              {/* Use button or div instead of anchor if not navigating */}
              <button
                onClick={(e) => handleMenuClick(item.key, e)}
                className={`
                  flex items-center rounded-lg p-2 w-full text-left
                  text-gray-700 hover:bg-gray-100 group
                  ${isCollapsed ? 'lg:justify-center' : ''} // Center icon when collapsed
                  ${activeSubMenu === item.key ? 'bg-gray-100' : ''} // Highlight active item
                `}
                title={item.name} // Show tooltip, especially when collapsed
              >
                <item.icon
                  className={`
                    h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900
                    ${activeSubMenu === item.key ? 'text-gray-900' : ''} // Icon color for active
                  `}
                  aria-hidden="true"
                />
                {/* Text span - hidden on large screens when collapsed */}
                <span
                 className={`
                    ml-3 whitespace-nowrap
                    ${isCollapsed ? 'lg:hidden' : 'lg:inline'}
                 `}
                 >
                  {item.name}
                 </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;