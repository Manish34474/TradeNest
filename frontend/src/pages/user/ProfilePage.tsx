import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Calendar, User, Settings } from "lucide-react"
import useAuth from "@/hooks/useAuth"

export default function ProfilePage() {
    const { auth } = useAuth();

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
                        <p className="text-muted-foreground">Manage your account information and preferences</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Personal Information Card */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center text-primary">
                                <User className="mr-2 h-5 w-5" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                <p className="text-lg font-semibold text-card-foreground">{auth.username}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Bio</label>
                                {/* <p className="text-card-foreground">{auth}</p> */}
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                                    {auth.roles.includes(949) ? "Admin" : auth.roles.includes(747) ? "Seller" : "User"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information Card */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center text-primary">
                                <Mail className="mr-2 h-5 w-5" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <p className="text-card-foreground">{auth.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                    {/* <p className="text-card-foreground">{user.phone}</p> */}
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                                    {/* <p className="text-card-foreground">{user.location}</p> */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Details Card */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center text-primary">
                                <Calendar className="mr-2 h-5 w-5" />
                                Account Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                                {/* <p className="text-card-foreground">{user.joinDate}</p>s */}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                                <div className="mt-1">
                                    <Badge variant="outline" className="border-accent text-accent">
                                        Active
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preferences Card */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center text-primary">
                                <Settings className="mr-2 h-5 w-5" />
                                Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-card-foreground">Email Notifications</span>
                                <Badge variant={"secondary"}>
                                    Disabled
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-card-foreground">Newsletter</span>
                                <Badge variant={"secondary"}>
                                    Unsubscribed
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-card-foreground">Dark Mode</span>
                                <Badge variant={"secondary"}>
                                    {"Off"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
