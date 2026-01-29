import { useState, useEffect } from "react";
import { Package, ChevronDown, ChevronUp, RotateCcw, Clock, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/contexts/ProfileContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AuthModal from "./AuthModal";

interface OrderItem {
  id: string;
  cookie_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  full_name: string;
  address: string;
  city: string;
  items: OrderItem[];
}

const OrderHistory = () => {
  const { isLoggedIn, session } = useProfile();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn && session) {
      fetchOrders();
    }
  }, [isLoggedIn, session]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Use secure RPC function that validates auth.uid()
      const { data: ordersData, error: ordersError } = await supabase.rpc("get_my_orders");

      if (ordersError) {
        if (ordersError.message.includes("Not authenticated")) {
          setOrders([]);
          return;
        }
        throw ordersError;
      }

      if (ordersData && ordersData.length > 0) {
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order: any) => {
            // Use secure RPC function to get order items
            const { data: itemsData } = await supabase.rpc("get_my_order_items", {
              order_uuid: order.id,
            });

            return {
              ...order,
              items: itemsData || [],
            };
          })
        );

        setOrders(ordersWithItems);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart({
        name: item.cookie_name,
        price: `₪${item.price}`,
        image: "",
      });
    });
    toast.success("הפריטים נוספו לעגלה!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, { label: string; color: string }> = {
      pending: { label: "ממתין לאישור", color: "bg-yellow-500" },
      confirmed: { label: "אושר", color: "bg-blue-500" },
      preparing: { label: "בהכנה", color: "bg-orange-500" },
      delivering: { label: "במשלוח", color: "bg-purple-500" },
      completed: { label: "הושלם", color: "bg-green-500" },
      cancelled: { label: "בוטל", color: "bg-red-500" },
    };
    return statuses[status] || { label: status, color: "bg-gray-500" };
  };

  if (!isLoggedIn) {
    return (
      <>
        <section id="order-history" className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-md mx-auto">
              <Clock className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                היסטוריית הזמנות
              </h2>
              <p className="text-muted-foreground mb-4">
                התחברו כדי לראות את ההזמנות הקודמות
              </p>
              <Button onClick={() => setAuthModalOpen(true)} variant="outline" className="gap-2">
                <KeyRound className="w-4 h-4" />
                התחברות
              </Button>
            </div>
          </div>
        </section>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  return (
    <section id="order-history" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            ההזמנות שלי
          </h2>
          <p className="text-muted-foreground">
            צפייה והזמנה חוזרת של הזמנות קודמות
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">טוען הזמנות...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 max-w-md mx-auto">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">אין הזמנות קודמות</p>
            <p className="text-muted-foreground text-sm mt-2">
              ההזמנות שלכם יופיעו כאן
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {orders.map((order) => {
              const status = getStatusLabel(order.status);
              const isExpanded = expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Package className="w-10 h-10 text-primary" />
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {formatDate(order.created_at)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`w-2 h-2 rounded-full ${status.color}`}
                          />
                          <span className="text-sm text-muted-foreground">
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-primary text-lg">
                        ₪{order.total_amount}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-border">
                      <div className="space-y-2 py-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-foreground">
                              {item.cookie_name} x{item.quantity}
                            </span>
                            <span className="text-muted-foreground">
                              ₪{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleReorder(order)}
                        variant="outline"
                        className="w-full gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        הזמנה חוזרת
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderHistory;
