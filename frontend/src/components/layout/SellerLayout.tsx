import { Outlet } from "react-router-dom";
import { useState } from "react";
import SellerHeader from "../user/seller/SellerHeader";
import { SellerAside } from "../user/seller/SellerAside";

export default function SellerLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-background">
            {/* sidebar */}
            <SellerAside sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Header */}
                <SellerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                {/* Dashboard Content */}
                <Outlet />
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    )
}