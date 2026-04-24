import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ShoppingBag, Users, Mail, Star, LogOut, ShieldAlert, TrendingUp, Trash2 } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  full_name: string;
  city: string;
  phone: string;
}

interface Subscriber {
  id: string;
  email: string | null;
  phone: string | null;
  subscribed_at: string;
  is_active: boolean;
}

interface Review {
  id: string;
  cookie_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profilesCount, setProfilesCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    document.title = "פאנל ניהול | מזון האושר";
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    if (!isAdmin) {
      setDataLoading(false);
      return;
    }
    loadData();
  }, [authLoading, user, isAdmin, navigate]);

  const loadData = async () => {
    setDataLoading(true);
    const [ordersRes, subsRes, reviewsRes, profilesRes] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("newsletter_subscriptions").select("*").order("subscribed_at", { ascending: false }).limit(100),
      supabase.from("cookie_reviews").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
    ]);

    if (ordersRes.data) setOrders(ordersRes.data as Order[]);
    if (subsRes.data) setSubscribers(subsRes.data as Subscriber[]);
    if (reviewsRes.data) setReviews(reviewsRes.data as Review[]);
    if (profilesRes.count !== null) setProfilesCount(profilesRes.count);
    setDataLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      toast.error("שגיאה בעדכון ההזמנה");
      return;
    }
    toast.success("סטטוס עודכן");
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from("cookie_reviews").delete().eq("id", id);
    if (error) {
      toast.error("שגיאה במחיקה");
      return;
    }
    toast.success("הביקורת נמחקה");
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const deleteSubscriber = async (id: string) => {
    const { error } = await supabase.from("newsletter_subscriptions").delete().eq("id", id);
    if (error) {
      toast.error("שגיאה במחיקה");
      return;
    }
    toast.success("המנוי הוסר");
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <ShieldAlert className="h-7 w-7 text-destructive" />
            </div>
            <CardTitle>גישה נדחתה</CardTitle>
            <CardDescription>אין לך הרשאות לצפות בפאנל הניהול</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              משתמש: <code className="bg-muted px-2 py-0.5 rounded text-xs">{user?.email}</code>
            </p>
            <p className="text-xs text-muted-foreground">
              כדי להפוך למנהל, יש להוסיף שורה לטבלת <code>user_roles</code> עם ה-user_id שלך והערך <code>admin</code>.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <Button variant="outline" onClick={() => navigate("/")}>חזרה לדף הבית</Button>
              <Button variant="ghost" onClick={handleSignOut}>התנתק</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const activeSubscribers = subscribers.filter((s) => s.is_active).length;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">פאנל ניהול</h1>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            התנתק
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={ShoppingBag} label="הזמנות" value={orders.length} hint={`${pendingOrders} ממתינות`} />
          <StatCard icon={TrendingUp} label="הכנסות" value={`₪${totalRevenue.toLocaleString()}`} />
          <StatCard icon={Users} label="לקוחות" value={profilesCount} />
          <StatCard icon={Mail} label="מנויים" value={activeSubscribers} hint={`${subscribers.length} סה"כ`} />
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="orders">הזמנות</TabsTrigger>
            <TabsTrigger value="reviews">ביקורות ({reviews.length})</TabsTrigger>
            <TabsTrigger value="newsletter">ניוזלטר ({subscribers.length})</TabsTrigger>
          </TabsList>

          {dataLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>הזמנות אחרונות</CardTitle>
                    <CardDescription>ניהול וצפייה בכל ההזמנות</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">אין הזמנות עדיין</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>תאריך</TableHead>
                              <TableHead>לקוח</TableHead>
                              <TableHead>עיר</TableHead>
                              <TableHead>סכום</TableHead>
                              <TableHead>סטטוס</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="whitespace-nowrap text-xs">
                                  {new Date(order.created_at).toLocaleDateString("he-IL")}
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{order.full_name}</div>
                                  <div className="text-xs text-muted-foreground">{order.phone}</div>
                                </TableCell>
                                <TableCell>{order.city}</TableCell>
                                <TableCell className="font-semibold">₪{Number(order.total_amount).toLocaleString()}</TableCell>
                                <TableCell>
                                  <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v)}>
                                    <SelectTrigger className="w-32 h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">ממתין</SelectItem>
                                      <SelectItem value="confirmed">אושר</SelectItem>
                                      <SelectItem value="preparing">בהכנה</SelectItem>
                                      <SelectItem value="delivered">נמסר</SelectItem>
                                      <SelectItem value="cancelled">בוטל</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>ביקורות לקוחות</CardTitle>
                    <CardDescription>דירוג ממוצע: {avgRating} ⭐</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {reviews.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">אין ביקורות עדיין</p>
                    ) : (
                      reviews.map((r) => (
                        <div key={r.id} className="border border-border rounded-lg p-3 flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary">{r.cookie_name}</Badge>
                              <span className="text-amber-500 text-sm">
                                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="inline h-3 w-3 fill-current" />)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(r.created_at).toLocaleDateString("he-IL")}
                              </span>
                            </div>
                            {r.review_text && <p className="text-sm">{r.review_text}</p>}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteReview(r.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="newsletter">
                <Card>
                  <CardHeader>
                    <CardTitle>מנויי ניוזלטר</CardTitle>
                    <CardDescription>{activeSubscribers} מנויים פעילים מתוך {subscribers.length}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {subscribers.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">אין מנויים עדיין</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>אימייל</TableHead>
                              <TableHead>טלפון</TableHead>
                              <TableHead>תאריך</TableHead>
                              <TableHead>סטטוס</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {subscribers.map((s) => (
                              <TableRow key={s.id}>
                                <TableCell dir="ltr" className="text-sm">{s.email || "—"}</TableCell>
                                <TableCell dir="ltr" className="text-sm">{s.phone || "—"}</TableCell>
                                <TableCell className="text-xs">{new Date(s.subscribed_at).toLocaleDateString("he-IL")}</TableCell>
                                <TableCell>
                                  <Badge variant={s.is_active ? "default" : "secondary"}>
                                    {s.is_active ? "פעיל" : "לא פעיל"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" onClick={() => deleteSubscriber(s.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; hint?: string }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </CardContent>
  </Card>
);

export default Admin;
