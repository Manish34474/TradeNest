import { Outlet } from "react-router-dom";
import AdminHeader from "../user/AdminHeader";
import { Aside } from "../user/Aside";
import { useState } from "react";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-background">
            {/* sidebar */}
            <Aside sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Header */}
                <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                {/* Dashboard Content */}
                <Outlet />
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    )
}