import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Cake, 
  DollarSign, 
  Package, 
  ShoppingBag, 
  Clock, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Share2, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  TrendingUp, 
  ChefHat, 
  Printer, 
  Copy, 
  ArrowRight,
  Filter,
  RefreshCw,
  X,
  ChevronRight,
  Sparkles,
  Download,
  Globe
} from 'lucide-react';

// --- HELPER FORMATTER ---
const formatCurrency = (amount, currencySymbol = '$') => {
  const numericAmount = Number(amount) || 0;
  return `${currencySymbol}${numericAmount.toFixed(2)}`;
};

// --- SAMPLE INITIAL DATA ---
const INITIAL_SETTINGS = {
  currency: '$',
  hourlyLaborRate: 15.00, // $ per hour
  defaultMargin: 40,      // 40% profit margin
  wastagePercent: 5,     // 5% wastage
  overheadPercent: 15,    // 15% indirect costs (gas, electric, equipment)
  businessName: 'Dulces Delicias Repostería',
  phone: '+54 9 11 9876-5432',
  email: 'contacto@dulcesdelicias.com'
};

const INITIAL_INGREDIENTS = [
  { id: '1', name: 'Harina de Trigo 0000', category: 'Harinas', purchasePrice: 4.50, packageSize: 1000, unit: 'g', currentStock: 4500, minStock: 2000 },
  { id: '2', name: 'Mantequilla sin sal', category: 'Lácteos', purchasePrice: 8.00, packageSize: 500, unit: 'g', currentStock: 1200, minStock: 1000 },
  { id: '3', name: 'Azúcar Blanca Refinada', category: 'Endulzantes', purchasePrice: 3.20, packageSize: 1000, unit: 'g', currentStock: 5000, minStock: 1500 },
  { id: '4', name: 'Chocolate Cobertura 70%', category: 'Chocolates', purchasePrice: 18.00, packageSize: 1000, unit: 'g', currentStock: 800, minStock: 1500 }, // Low stock
  { id: '5', name: 'Huevos Frescos (Docena)', category: 'Huevos & Lácteos', purchasePrice: 3.60, packageSize: 12, unit: 'unidad', currentStock: 24, minStock: 12 },
  { id: '6', name: 'Queso Crema Tipo Cream Cheese', category: 'Lácteos', purchasePrice: 6.50, packageSize: 400, unit: 'g', currentStock: 1600, minStock: 800 },
  { id: '7', name: 'Esencia de Vainilla Pura', category: 'Saborizantes', purchasePrice: 5.00, packageSize: 100, unit: 'ml', currentStock: 250, minStock: 50 },
  { id: '8', name: 'Polvo de Hornear', category: 'Levaduras & Impulsores', purchasePrice: 2.50, packageSize: 250, unit: 'g', currentStock: 400, minStock: 100 },
  { id: '9', name: 'Caja Premium Pasteles 25x25', category: 'Empaque', purchasePrice: 2.20, packageSize: 1, unit: 'unidad', currentStock: 15, minStock: 10 },
  { id: '10', name: 'Bandeja Dorada Rígida #24', category: 'Empaque', purchasePrice: 1.50, packageSize: 1, unit: 'unidad', currentStock: 8, minStock: 10 }, // Low stock
  { id: '11', name: 'Caja para Cupcakes x6', category: 'Empaque', purchasePrice: 1.80, packageSize: 1, unit: 'unidad', currentStock: 30, minStock: 15 },
];

const INITIAL_RECIPES = [
  {
    id: 'rec_1',
    name: 'Torta Red Velvet Clásica',
    category: 'Pasteles Integrales',
    servings: 12,
    prepTimeMinutes: 120, // 2 hours
    marginPercent: 45,
    description: 'Bizcocho terciopelo rojo con suave cobertura de crema de queso.',
    ingredients: [
      { ingredientId: '1', quantity: 350 }, // Harina
      { ingredientId: '2', quantity: 150 }, // Mantequilla
      { ingredientId: '3', quantity: 300 }, // Azúcar
      { ingredientId: '5', quantity: 3 },   // Huevos
      { ingredientId: '6', quantity: 400 }, // Queso crema
      { ingredientId: '7', quantity: 15 },  // Vainilla
      { ingredientId: '8', quantity: 10 },  // Polvo hornear
      { ingredientId: '9', quantity: 1 },   // Caja 25x25
      { ingredientId: '10', quantity: 1 },  // Bandeja dorada
    ]
  },
  {
    id: 'rec_2',
    name: 'Pack Cupcakes Vainilla & Chocolate (x6)',
    category: 'Cupcakes & Minis',
    servings: 6,
    prepTimeMinutes: 60, // 1 hour
    marginPercent: 40,
    description: 'Deliciosos cupcakes de vainilla rellenos con ganache de chocolate.',
    ingredients: [
      { ingredientId: '1', quantity: 200 }, // Harina
      { ingredientId: '2', quantity: 100 }, // Mantequilla
      { ingredientId: '3', quantity: 180 }, // Azúcar
      { ingredientId: '4', quantity: 150 }, // Chocolate
      { ingredientId: '5', quantity: 2 },   // Huevos
      { ingredientId: '7', quantity: 10 },  // Vainilla
      { ingredientId: '11', quantity: 1 },  // Caja cupcakes x6
    ]
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-101',
    customerName: 'Mariana Gómez',
    customerPhone: '+54 9 11 4455-6677',
    deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    status: 'In Progress',
    items: [
      { recipeId: 'rec_1', name: 'Torta Red Velvet Clásica', quantity: 1, unitPrice: 42.50 }
    ],
    totalAmount: 42.50,
    depositPaid: 20.00,
    notes: 'Agregar dedicatoria: "Feliz Cumpleaños Mamá!" en tono rosa.',
    inventoryDeducted: false
  },
  {
    id: 'ORD-102',
    customerName: 'Carlos Benítez',
    customerPhone: '+54 9 11 2233-4455',
    deliveryDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    status: 'Pending',
    items: [
      { recipeId: 'rec_2', name: 'Pack Cupcakes Vainilla & Chocolate (x6)', quantity: 2, unitPrice: 22.00 }
    ],
    totalAmount: 44.00,
    depositPaid: 22.00,
    notes: 'Entrega por la tarde después de las 16:00 hs.',
    inventoryDeducted: false
  }
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Modals state
  const [isIngModalOpen, setIsIngModalOpen] = useState(false);
  const [editingIng, setEditingIng] = useState(null);

  const [isRecModalOpen, setIsRecModalOpen] = useState(false);
  const [editingRec, setEditingRec] = useState(null);
  const [isAiRecipeModalOpen, setIsAiRecipeModalOpen] = useState(false);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [activeQuoteRecipe, setActiveQuoteRecipe] = useState(null);
  const [quoteCustoms, setQuoteCustoms] = useState({
    portionsMultiplier: 1,
    extraDecorationsCost: 0,
    deliveryCost: 0,
    customMargin: null
  });
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [pdfInvoiceData, setPdfInvoiceData] = useState(null);

  const formatWithCurrency = (amount) => formatCurrency(amount, settings.currency);

  const getIngredientCostPerUnit = (ing) => {
    if (!ing || !ing.packageSize || ing.packageSize <= 0) return 0;
    return ing.purchasePrice / ing.packageSize;
  };

  const calculateRecipeCost = (recipe, customSettings = settings) => {
    if (!recipe) return { rawIngredientsCost: 0, laborCost: 0, wastageCost: 0, overheadCost: 0, totalNetCost: 0, suggestedPrice: 0, profit: 0, costPerServing: 0, pricePerServing: 0 };

    let rawIngredientsCost = 0;
    (recipe.ingredients || []).forEach(item => {
      const ing = ingredients.find(i => i.id === item.ingredientId);
      if (ing) {
        const unitCost = getIngredientCostPerUnit(ing);
        rawIngredientsCost += unitCost * item.quantity;
      }
    });

    const prepHours = (recipe.prepTimeMinutes || 0) / 60;
    const laborCost = prepHours * customSettings.hourlyLaborRate;
    const wastageCost = rawIngredientsCost * (customSettings.wastagePercent / 100);
    const overheadCost = (rawIngredientsCost + laborCost) * (customSettings.overheadPercent / 100);

    const totalNetCost = rawIngredientsCost + laborCost + wastageCost + overheadCost;
    const margin = recipe.marginPercent !== undefined ? recipe.marginPercent : customSettings.defaultMargin;
    const suggestedPrice = margin < 100 ? totalNetCost / (1 - (margin / 100)) : totalNetCost * 2;
    const profit = suggestedPrice - totalNetCost;
    
    const servings = recipe.servings > 0 ? recipe.servings : 1;
    const costPerServing = totalNetCost / servings;
    const pricePerServing = suggestedPrice / servings;

    return {
      rawIngredientsCost,
      laborCost,
      wastageCost,
      overheadCost,
      totalNetCost,
      suggestedPrice,
      profit,
      servings,
      costPerServing,
      pricePerServing
    };
  };

  const lowStockIngredients = useMemo(() => {
    return ingredients.filter(i => i.currentStock <= i.minStock);
  }, [ingredients]);

  const openQuotePdfModal = () => {
    if (!activeQuoteRecipe) return;
    const effectiveMargin = quoteCustoms.customMargin !== null ? quoteCustoms.customMargin : activeQuoteRecipe.marginPercent;
    const baseCosts = calculateRecipeCost({ ...activeQuoteRecipe, marginPercent: effectiveMargin });
    const subtotal = baseCosts.suggestedPrice * quoteCustoms.portionsMultiplier;
    const finalSalePrice = subtotal + quoteCustoms.extraDecorationsCost + quoteCustoms.deliveryCost;

    setPdfInvoiceData({
      docNumber: 'COT-' + Math.floor(1000 + Math.random() * 9000),
      title: 'Presupuesto de Repostería',
      customerName: 'Cliente General / WhatsApp',
      customerPhone: '',
      date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
      deliveryDate: 'A convenir con la repostera',
      items: [
        {
          description: `${activeQuoteRecipe.name} (${activeQuoteRecipe.servings * quoteCustoms.portionsMultiplier} porciones aprox.)`,
          quantity: quoteCustoms.portionsMultiplier,
          unitPrice: baseCosts.suggestedPrice,
          total: subtotal
        },
        ...(quoteCustoms.extraDecorationsCost > 0 ? [{
          description: 'Decoración y Adicionales Personalizados',
          quantity: 1,
          unitPrice: quoteCustoms.extraDecorationsCost,
          total: quoteCustoms.extraDecorationsCost
        }] : []),
        ...(quoteCustoms.deliveryCost > 0 ? [{
          description: 'Servicio de Envío / Flete',
          quantity: 1,
          unitPrice: quoteCustoms.deliveryCost,
          total: quoteCustoms.deliveryCost
        }] : [])
      ],
      subtotal: finalSalePrice,
      depositPaid: 0,
      totalAmount: finalSalePrice,
      notes: 'Presupuesto válido por 7 días. Los pedidos se confirman abonando el 50% de seña anticipada.'
    });
    setShowInvoiceModal(true);
  };

  const openOrderPdfModal = (order) => {
    const balanceDue = order.totalAmount - (order.depositPaid || 0);
    setPdfInvoiceData({
      docNumber: order.id,
      title: 'Nota de Pedido y Cotización',
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
      deliveryDate: order.deliveryDate,
      status: order.status,
      items: order.items.map(item => ({
        description: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.unitPrice * item.quantity
      })),
      subtotal: order.totalAmount,
      depositPaid: order.depositPaid || 0,
      totalAmount: order.totalAmount,
      balanceDue: balanceDue,
      notes: order.notes || 'Recuerda conservar este comprobante. El saldo restante se cancela al momento de la entrega.'
    });
    setShowInvoiceModal(true);
  };

  const handleSaveIngredient = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newIng = {
      id: editingIng ? editingIng.id : Date.now().toString(),
      name: formData.get('name'),
      category: formData.get('category'),
      purchasePrice: parseFloat(formData.get('purchasePrice')),
      packageSize: parseFloat(formData.get('packageSize')),
      unit: formData.get('unit'),
      currentStock: parseFloat(formData.get('currentStock')),
      minStock: parseFloat(formData.get('minStock'))
    };

    if (editingIng) {
      setIngredients(ingredients.map(i => i.id === editingIng.id ? newIng : i));
    } else {
      setIngredients([...ingredients, newIng]);
    }
    setIsIngModalOpen(false);
    setEditingIng(null);
  };

  const handleDeleteIngredient = (id) => {
    if (confirm('¿Estás seguro de eliminar este ingrediente?')) {
      setIngredients(ingredients.filter(i => i.id !== id));
    }
  };

  const handleSaveRecipe = (recipeData) => {
    if (editingRec) {
      setRecipes(recipes.map(r => r.id === editingRec.id ? recipeData : r));
    } else {
      setRecipes([...recipes, { ...recipeData, id: 'rec_' + Date.now() }]);
    }
    setIsRecModalOpen(false);
    setEditingRec(null);
  };

  const handleDeleteRecipe = (id) => {
    if (confirm('¿Eliminar esta receta del catálogo?')) {
      setRecipes(recipes.filter(r => r.id !== id));
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => prevOrders.map(ord => {
      if (ord.id === orderId) {
        let shouldDeduct = false;
        let shouldRestore = false;

        if (newStatus === 'Completed' && !ord.inventoryDeducted) {
          shouldDeduct = true;
        } else if (newStatus !== 'Completed' && ord.inventoryDeducted) {
          shouldRestore = true;
        }

        if (shouldDeduct) {
          ord.items.forEach(item => {
            const rec = recipes.find(r => r.id === item.recipeId);
            if (rec) {
              rec.ingredients.forEach(ingReq => {
                setIngredients(prevIngs => prevIngs.map(ing => {
                  if (ing.id === ingReq.ingredientId) {
                    return {
                      ...ing,
                      currentStock: Math.max(0, ing.currentStock - (ingReq.quantity * item.quantity))
                    };
                  }
                  return ing;
                }));
              });
            }
          });
          return { ...ord, status: newStatus, inventoryDeducted: true };
        } else if (shouldRestore) {
          ord.items.forEach(item => {
            const rec = recipes.find(r => r.id === item.recipeId);
            if (rec) {
              rec.ingredients.forEach(ingReq => {
                setIngredients(prevIngs => prevIngs.map(ing => {
                  if (ing.id === ingReq.ingredientId) {
                    return {
                      ...ing,
                      currentStock: ing.currentStock + (ingReq.quantity * item.quantity)
                    };
                  }
                  return ing;
                }));
              });
            }
          });
          return { ...ord, status: newStatus, inventoryDeducted: false };
        }

        return { ...ord, status: newStatus };
      }
      return ord;
    }));
  };

  const handleDeleteOrder = (id) => {
    if (confirm('¿Deseas eliminar este pedido?')) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-800 flex flex-col md:flex-row font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white border-r border-amber-100 flex-shrink-0 shadow-sm">
        <div className="p-6 border-b border-amber-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-200">
            <Cake className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 leading-tight">Dulces Herramientas</h1>
            <p className="text-xs text-pink-600 font-medium">Costos & Repostería</p>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          <NavItem id="dashboard" icon={<TrendingUp className="w-5 h-5"/>} label="Panel General" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="recipes" icon={<ChefHat className="w-5 h-5"/>} label="Recetas y Costos" count={recipes.length} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="ingredients" icon={<Package className="w-5 h-5"/>} label="Ingredientes & Stock" alert={lowStockIngredients.length} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="quote" icon={<Sparkles className="w-5 h-5"/>} label="Cotizador Rápido" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="orders" icon={<ShoppingBag className="w-5 h-5"/>} label="Pedidos & CRM" count={orders.filter(o => o.status !== 'Completed').length} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="settings" icon={<Settings className="w-5 h-5"/>} label="Configuración General" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>

        {lowStockIngredients.length > 0 && (
          <div className="m-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-900">{lowStockIngredients.length} Insumos bajos de stock</p>
              <button 
                onClick={() => setActiveTab('ingredients')}
                className="text-xs text-amber-700 underline hover:text-amber-900 mt-1 block font-medium"
              >
                Revisar Inventario &rarr;
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">¡Hola, Pastelera! 👋</h2>
                <p className="text-slate-500 text-sm">Resumen general de tu negocio dulce hoy.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setActiveQuoteRecipe(recipes[0] || null);
                    setActiveTab('quote');
                  }}
                  className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Nueva Cotización
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard title="Pedidos Activos" value={orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length} subText="En proceso o pendientes" icon={<ShoppingBag className="w-5 h-5 text-pink-600"/>} bg="bg-pink-50" />
              <KPICard title="Ventas del Mes (Est.)" value={formatWithCurrency(orders.filter(o => o.status === 'Completed' || o.status === 'In Progress').reduce((acc, o) => acc + o.totalAmount, 0))} subText="Proyectado activo" icon={<DollarSign className="w-5 h-5 text-emerald-600"/>} bg="bg-emerald-50" />
              <KPICard title="Recetas Registradas" value={recipes.length} subText="Catálogo de productos" icon={<ChefHat className="w-5 h-5 text-amber-600"/>} bg="bg-amber-50" />
              <KPICard title="Alertas de Stock" value={lowStockIngredients.length} subText="Insumos bajo el mínimo" icon={<AlertTriangle className="w-5 h-5 text-rose-600"/>} bg="bg-rose-50" highlight={lowStockIngredients.length > 0} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-amber-100/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-pink-500" /> Próximas Entregas
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-pink-600 font-semibold hover:underline">Ver todos &rarr;</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <p className="text-slate-400 text-sm py-4">No hay pedidos registrados aún.</p>
                  ) : (
                    orders.slice(0, 5).map(ord => (
                      <div key={ord.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{ord.customerName}</p>
                          <p className="text-xs text-slate-500">{ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            📅 {ord.deliveryDate}
                          </span>
                          <span className="font-bold text-sm text-slate-900">{formatWithCurrency(ord.totalAmount)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-amber-100/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-500" /> Reponer Pronto
                  </h3>
                  <button onClick={() => setActiveTab('ingredients')} className="text-xs text-pink-600 font-semibold hover:underline">Ir a Stock &rarr;</button>
                </div>

                <div className="space-y-3">
                  {lowStockIngredients.length === 0 ? (
                    <div className="text-center py-6">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                      <p className="text-xs text-slate-500">¡Todo el inventario está completo!</p>
                    </div>
                  ) : (
                    lowStockIngredients.map(ing => (
                      <div key={ing.id} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-800">{ing.name}</p>
                          <p className="text-amber-700">Stock: <strong className="text-rose-600">{ing.currentStock} {ing.unit}</strong> (Mín: {ing.minStock})</p>
                        </div>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded font-bold">Reponer</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Ingredientes y Empaques</h2>
                <p className="text-slate-500 text-sm">Gestiona tus materias primas y calcula el costo por gramo/unidad.</p>
              </div>
              <button 
                onClick={() => { setEditingIng(null); setIsIngModalOpen(true); }}
                className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2 self-start"
              >
                <Plus className="w-4 h-4" /> Agregar Insumo
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-amber-50/50 border-b border-amber-100 text-slate-600 font-semibold">
                      <th className="p-4">Ingrediente / Material</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Precio Paquete</th>
                      <th className="p-4">Presentación</th>
                      <th className="p-4">Costo Unitario Calculado</th>
                      <th className="p-4">Stock Actual</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ingredients.map(ing => {
                      const costPerUnit = getIngredientCostPerUnit(ing);
                      const isLow = ing.currentStock <= ing.minStock;
                      return (
                        <tr key={ing.id} className="hover:bg-amber-50/20 transition">
                          <td className="p-4 font-semibold text-slate-800">{ing.name}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                              {ing.category}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-slate-700">{formatWithCurrency(ing.purchasePrice)}</td>
                          <td className="p-4 text-slate-600">{ing.packageSize} {ing.unit}</td>
                          <td className="p-4 font-semibold text-emerald-700">
                            {formatWithCurrency(costPerUnit)} / {ing.unit}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${isLow ? 'text-rose-600' : 'text-slate-700'}`}>
                                {ing.currentStock} {ing.unit}
                              </span>
                              {isLow && (
                                <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3"/> Bajo
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right space-x-1">
                            <button 
                              onClick={() => { setEditingIng(ing); setIsIngModalOpen(true); }}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteIngredient(ing.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Catálogo de Recetas & Escandallos</h2>
                <p className="text-slate-500 text-sm">Cálculo exacto de costos directos, indirectos y margen de ganancia real.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setIsAiRecipeModalOpen(true)}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" /> Buscar Receta en Internet (AI)
                </button>
                <button 
                  onClick={() => { setEditingRec(null); setIsRecModalOpen(true); }}
                  className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Crear Manual
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipes.map(recipe => {
                const costs = calculateRecipeCost(recipe);
                return (
                  <div key={recipe.id} className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-semibold px-2.5 py-0.5 bg-pink-50 text-pink-700 rounded-md">
                            {recipe.category || 'General'}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 mt-1">{recipe.name}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Precio Sugerido</p>
                          <p className="text-xl font-black text-emerald-600">{formatWithCurrency(costs.suggestedPrice)}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{recipe.description || 'Sin descripción'}</p>

                      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl mb-4 text-center text-xs">
                        <div>
                          <p className="text-slate-400">Porciones</p>
                          <p className="font-bold text-slate-700">{recipe.servings}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Tiempo Prep.</p>
                          <p className="font-bold text-slate-700">{recipe.prepTimeMinutes} min</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Margen %</p>
                          <p className="font-bold text-pink-600">{recipe.marginPercent}%</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600 mb-4 border-t border-slate-100 pt-3">
                        <div className="flex justify-between">
                          <span>Ingredientes y Empaque:</span>
                          <span className="font-semibold">{formatWithCurrency(costs.rawIngredientsCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mano de obra ({recipe.prepTimeMinutes}m):</span>
                          <span className="font-semibold">{formatWithCurrency(costs.laborCost)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Mermas ({settings.wastagePercent}%) + Fijos ({settings.overheadPercent}%):</span>
                          <span>{formatWithCurrency(costs.wastageCost + costs.overheadCost)}</span>
                        </div>
                        <div className="flex justify-between text-slate-900 font-bold border-t border-dashed border-slate-200 pt-1 mt-1">
                          <span>Costo Neto Total:</span>
                          <span className="text-rose-600">{formatWithCurrency(costs.totalNetCost)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Ganancia Estimada:</span>
                          <span>{formatWithCurrency(costs.profit)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                      <button 
                        onClick={() => {
                          setActiveQuoteRecipe(recipe);
                          setActiveTab('quote');
                        }}
                        className="text-xs bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5"/> Cotizar a Cliente
                      </button>

                      <div className="flex gap-1">
                        <button 
                          onClick={() => { setEditingRec(recipe); setIsRecModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRecipe(recipe.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'quote' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Cotizador Rápido de Presupuestos</h2>
              <p className="text-slate-500 text-sm">Genera una propuesta personalizada para tu cliente en segundos.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">1. Seleccionar Receta / Producto Base</label>
                  <select 
                    value={activeQuoteRecipe ? activeQuoteRecipe.id : ''} 
                    onChange={(e) => {
                      const found = recipes.find(r => r.id === e.target.value);
                      setActiveQuoteRecipe(found || null);
                    }}
                    className="w-full p-3 bg-amber-50/40 border border-amber-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">-- Selecciona un producto del catálogo --</option>
                    {recipes.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.servings} porciones base)</option>
                    ))}
                  </select>
                </div>

                {activeQuoteRecipe && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Multiplicador / Cantidad</label>
                        <input 
                          type="number" 
                          min="0.5" 
                          step="0.5"
                          value={quoteCustoms.portionsMultiplier} 
                          onChange={(e) => setQuoteCustoms({...quoteCustoms, portionsMultiplier: parseFloat(e.target.value) || 1})}
                          className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                        />
                        <span className="text-[11px] text-slate-400 mt-0.5 block">Equivale a {activeQuoteRecipe.servings * quoteCustoms.portionsMultiplier} porciones totales</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Margen Personalizado (%)</label>
                        <input 
                          type="number" 
                          placeholder={`Por defecto (${activeQuoteRecipe.marginPercent}%)`}
                          value={quoteCustoms.customMargin !== null ? quoteCustoms.customMargin : ''} 
                          onChange={(e) => setQuoteCustoms({...quoteCustoms, customMargin: e.target.value === '' ? null : parseFloat(e.target.value)})}
                          className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Decoración / Adicionales ({settings.currency})</label>
                        <input 
                          type="number" 
                          min="0"
                          value={quoteCustoms.extraDecorationsCost} 
                          onChange={(e) => setQuoteCustoms({...quoteCustoms, extraDecorationsCost: parseFloat(e.target.value) || 0})}
                          className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                          placeholder="Ej. Cake topper, Flores"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Costo de Envío / Flete ({settings.currency})</label>
                        <input 
                          type="number" 
                          min="0"
                          value={quoteCustoms.deliveryCost} 
                          onChange={(e) => setQuoteCustoms({...quoteCustoms, deliveryCost: parseFloat(e.target.value) || 0})}
                          className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {activeQuoteRecipe ? (
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-pink-400 bg-pink-950/60 px-2.5 py-1 rounded-md">
                      Resumen del Presupuesto
                    </span>
                    <h3 className="text-xl font-bold mt-2 text-white">{activeQuoteRecipe.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {activeQuoteRecipe.servings * quoteCustoms.portionsMultiplier} Porciones aprox.
                    </p>

                    {(() => {
                      const effectiveMargin = quoteCustoms.customMargin !== null ? quoteCustoms.customMargin : activeQuoteRecipe.marginPercent;
                      const baseCosts = calculateRecipeCost({ ...activeQuoteRecipe, marginPercent: effectiveMargin });
                      const totalCost = (baseCosts.totalNetCost * quoteCustoms.portionsMultiplier) + quoteCustoms.extraDecorationsCost;
                      const finalSalePrice = (baseCosts.suggestedPrice * quoteCustoms.portionsMultiplier) + quoteCustoms.extraDecorationsCost + quoteCustoms.deliveryCost;
                      const netProfit = finalSalePrice - totalCost - quoteCustoms.deliveryCost;

                      return (
                        <div className="mt-6 space-y-3 border-t border-slate-700/80 pt-4">
                          <div className="flex justify-between text-xs text-slate-300">
                            <span>Costo de Producción:</span>
                            <span className="font-semibold text-rose-400">{formatWithCurrency(totalCost)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-300">
                            <span>Envío / Delivery:</span>
                            <span>{formatWithCurrency(quoteCustoms.deliveryCost)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                            <span>Ganancia Neta Estimada:</span>
                            <span>{formatWithCurrency(netProfit)} ({effectiveMargin}%)</span>
                          </div>

                          <div className="border-t border-slate-700 pt-3 mt-4">
                            <span className="text-xs text-slate-400">Precio Final al Cliente</span>
                            <p className="text-3xl font-black text-white">{formatWithCurrency(finalSalePrice)}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="mt-6 space-y-2">
                    <button 
                      onClick={openQuotePdfModal}
                      className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-pink-500/20"
                    >
                      <Printer className="w-4 h-4"/> Generar Documento PDF / Imprimir
                    </button>
                    
                    <button 
                      onClick={() => {
                        const effectiveMargin = quoteCustoms.customMargin !== null ? quoteCustoms.customMargin : activeQuoteRecipe.marginPercent;
                        const baseCosts = calculateRecipeCost({ ...activeQuoteRecipe, marginPercent: effectiveMargin });
                        const finalSalePrice = (baseCosts.suggestedPrice * quoteCustoms.portionsMultiplier) + quoteCustoms.extraDecorationsCost + quoteCustoms.deliveryCost;

                        const text = `🌸 *${settings.businessName}* 🌸\n\n` +
                          `¡Hola! Aquí tienes la cotización detallada para tu pedido:\n\n` +
                          `🍰 *Producto:* ${activeQuoteRecipe.name}\n` +
                          `👥 *Rendimiento:* ${activeQuoteRecipe.servings * quoteCustoms.portionsMultiplier} porciones\n` +
                          (quoteCustoms.extraDecorationsCost > 0 ? `✨ *Detalles adicionales:* Incluidos\n` : '') +
                          (quoteCustoms.deliveryCost > 0 ? `🚚 *Envío / Flete:* ${formatWithCurrency(quoteCustoms.deliveryCost)}\n` : '') +
                          `\n💰 *TOTAL A ABONAR:* ${formatWithCurrency(finalSalePrice)}\n\n` +
                          `¿Te gustaría confirmarlo para agendar la fecha en el calendario? 😊`;

                        navigator.clipboard.writeText(text);
                        alert('¡Texto de cotización copiado al portapapeles con éxito! 📋✨');
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Copy className="w-4 h-4"/> Copiar Texto con Iconos para WhatsApp 📋
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 rounded-2xl p-6 text-center text-slate-400 flex flex-col items-center justify-center border border-dashed border-slate-300">
                  <ChefHat className="w-10 h-10 mb-2 opacity-50"/>
                  <p className="text-sm font-medium">Selecciona una receta a la izquierda para cotizar.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Gestión de Pedidos & Agenda</h2>
                <p className="text-slate-500 text-sm">Controla señas, fechas de entrega e inventarios de pedidos.</p>
              </div>
              <button 
                onClick={() => { setEditingOrder(null); setIsOrderModalOpen(true); }}
                className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2 self-start"
              >
                <Plus className="w-4 h-4" /> Nuevo Pedido
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map(order => {
                const balanceDue = order.totalAmount - (order.depositPaid || 0);
                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ID: {order.id}</span>
                          <h3 className="text-lg font-bold text-slate-900">{order.customerName}</h3>
                          <p className="text-xs text-slate-500">{order.customerPhone}</p>
                        </div>
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                            order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            order.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          <option value="Pending">Pendiente</option>
                          <option value="In Progress">En Proceso</option>
                          <option value="Completed">Entregado / Listo</option>
                          <option value="Cancelled">Cancelado</option>
                        </select>
                      </div>

                      <div className="bg-amber-50/40 p-3 rounded-xl space-y-1 text-xs">
                        <p className="font-semibold text-slate-700">Ítems encargados:</p>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-slate-600">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-semibold">{formatWithCurrency(item.unitPrice * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <p className="text-xs italic text-slate-500 bg-slate-50 p-2 rounded-lg">
                          "{order.notes}"
                        </p>
                      )}

                      <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-slate-100 pt-3">
                        <div>
                          <span className="text-slate-400 block">Total</span>
                          <span className="font-bold text-slate-900">{formatWithCurrency(order.totalAmount)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Seña / Abonado</span>
                          <span className="font-bold text-emerald-600">{formatWithCurrency(order.depositPaid)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Saldo Pendiente</span>
                          <span className={`font-bold ${balanceDue > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                            {formatWithCurrency(balanceDue)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
                      <span>📅 Entrega: <strong>{order.deliveryDate}</strong></span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => openOrderPdfModal(order)}
                          className="px-2.5 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold rounded-lg transition flex items-center gap-1 text-xs"
                          title="Ver / Exportar PDF"
                        >
                          <FileText className="w-3.5 h-3.5"/> PDF / Recibo
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Configuración General de Costos</h2>
              <p className="text-slate-500 text-sm">Establece los parámetros base de cálculo para todas tus recetas.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Moneda</label>
                  <input 
                    type="text" 
                    value={settings.currency} 
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                    placeholder="$, €, MXN, ARS, COP"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Valor Hora Trabajo ({settings.currency}/hora)</label>
                  <input 
                    type="number" 
                    value={settings.hourlyLaborRate} 
                    onChange={(e) => setSettings({...settings, hourlyLaborRate: parseFloat(e.target.value) || 0})}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">¿Cuánto vale tu hora de trabajo pastelero?</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">% Margen Objetivo</label>
                  <input 
                    type="number" 
                    value={settings.defaultMargin} 
                    onChange={(e) => setSettings({...settings, defaultMargin: parseFloat(e.target.value) || 0})}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">% Costos Indirectos</label>
                  <input 
                    type="number" 
                    value={settings.overheadPercent} 
                    onChange={(e) => setSettings({...settings, overheadPercent: parseFloat(e.target.value) || 0})}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                  <span className="text-[11px] text-slate-400 mt-[2px] block">Luz, gas, depreciación</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">% Merma / Desperdicio</label>
                  <input 
                    type="number" 
                    value={settings.wastagePercent} 
                    onChange={(e) => setSettings({...settings, wastagePercent: parseFloat(e.target.value) || 0})}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                  <span className="text-[11px] text-slate-400 mt-[2px] block">Sobres de harinas, derrames</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h4 className="font-bold text-slate-800 text-sm">Datos de la Marca</h4>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Nombre Comercial</label>
                  <input 
                    type="text" 
                    value={settings.businessName} 
                    onChange={(e) => setSettings({...settings, businessName: e.target.value})}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Teléfono / WhatsApp</label>
                    <input 
                      type="text" 
                      value={settings.phone} 
                      onChange={(e) => setSettings({...settings, phone: e.target.value})}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Email de contacto</label>
                    <input 
                      type="text" 
                      value={settings.email} 
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- INGREDIENT MODAL --- */}
      {isIngModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">{editingIng ? 'Editar Ingrediente' : 'Nuevo Ingrediente / Material'}</h3>
              <button onClick={() => setIsIngModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleSaveIngredient} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Insumo</label>
                <input required name="name" defaultValue={editingIng?.name || ''} className="w-full p-2.5 border rounded-xl text-sm" placeholder="Ej. Chocolate 70%" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
                  <input required name="category" defaultValue={editingIng?.category || 'Harinas'} className="w-full p-2.5 border rounded-xl text-sm" placeholder="Lácteos, Empaque..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unidad de Medida</label>
                  <select name="unit" defaultValue={editingIng?.unit || 'g'} className="w-full p-2.5 border rounded-xl text-sm">
                    <option value="g">Gramos (g)</option>
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="l">Litros (l)</option>
                    <option value="unidad">Unidades (ud)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Precio Paquete ({settings.currency})</label>
                  <input required type="number" step="0.01" name="purchasePrice" defaultValue={editingIng?.purchasePrice || ''} className="w-full p-2.5 border rounded-xl text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cantidad Paquete</label>
                  <input required type="number" step="0.01" name="packageSize" defaultValue={editingIng?.packageSize || ''} className="w-full p-2.5 border rounded-xl text-sm" placeholder="Ej. 1000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Actual</label>
                  <input required type="number" step="0.01" name="currentStock" defaultValue={editingIng?.currentStock || 0} className="w-full p-2.5 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Mínimo (Alerta)</label>
                  <input required type="number" step="0.01" name="minStock" defaultValue={editingIng?.minStock || 10} className="w-full p-2.5 border rounded-xl text-sm" />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setIsIngModalOpen(false)} className="w-1/2 py-2.5 border rounded-xl text-slate-600 text-sm font-semibold">Cancelar</button>
                <button type="submit" className="w-1/2 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-bold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- AI RECIPE SEARCH MODAL --- */}
      {isAiRecipeModalOpen && (
        <AIRecipeSearchModal 
          ingredients={ingredients}
          settings={settings}
          onClose={() => setIsAiRecipeModalOpen(false)}
          onAddRecipe={(newRec) => {
            setRecipes([...recipes, newRec]);
            setIsAiRecipeModalOpen(false);
          }}
        />
      )}

      {/* --- RECIPE MODAL --- */}
      {isRecModalOpen && (
        <RecipeModalForm 
          editingRec={editingRec}
          ingredients={ingredients}
          settings={settings}
          onClose={() => setIsRecModalOpen(false)}
          onSave={handleSaveRecipe}
          formatCurrency={formatWithCurrency}
        />
      )}

      {/* --- ORDER MODAL --- */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">Registrar Nuevo Pedido</h3>
              <button onClick={() => setIsOrderModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const recId = formData.get('recipeId');
              const rec = recipes.find(r => r.id === recId);
              const qty = parseInt(formData.get('quantity')) || 1;
              const unitPrice = parseFloat(formData.get('unitPrice')) || 0;
              const totalAmount = unitPrice * qty;

              const newOrd = {
                id: 'ORD-' + Math.floor(100 + Math.random() * 900),
                customerName: formData.get('customerName'),
                customerPhone: formData.get('customerPhone'),
                deliveryDate: formData.get('deliveryDate'),
                status: 'Pending',
                items: [{ recipeId: recId, name: rec ? rec.name : 'Producto Personalizado', quantity: qty, unitPrice }],
                totalAmount,
                depositPaid: parseFloat(formData.get('depositPaid')) || 0,
                notes: formData.get('notes'),
                inventoryDeducted: false
              };

              setOrders([newOrd, ...orders]);
              setIsOrderModalOpen(false);
            }} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Cliente</label>
                <input required name="customerName" className="w-full p-2.5 border rounded-xl text-sm" placeholder="Ej. Ana Martínez" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono / WhatsApp</label>
                <input required name="customerPhone" className="w-full p-2.5 border rounded-xl text-sm" placeholder="+54 9 11 ..." />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Producto / Receta</label>
                <select 
                  required 
                  name="recipeId" 
                  className="w-full p-2.5 border rounded-xl text-sm"
                  onChange={(e) => {
                    const selected = recipes.find(r => r.id === e.target.value);
                    if (selected) {
                      const costs = calculateRecipeCost(selected);
                      const priceInput = document.getElementById('orderUnitPriceInput');
                      if (priceInput) priceInput.value = costs.suggestedPrice.toFixed(2);
                    }
                  }}
                >
                  <option value="">Selecciona una receta...</option>
                  {recipes.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cantidad</label>
                  <input required type="number" min="1" name="quantity" defaultValue="1" className="w-full p-2.5 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Precio Unitario ({settings.currency})</label>
                  <input id="orderUnitPriceInput" required type="number" step="0.01" name="unitPrice" className="w-full p-2.5 border rounded-xl text-sm" placeholder="0.00" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de Entrega</label>
                  <input required type="date" name="deliveryDate" className="w-full p-2.5 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seña / Adelanto ({settings.currency})</label>
                  <input type="number" step="0.01" name="depositPaid" defaultValue="0" className="w-full p-2.5 border rounded-xl text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notas / Detalles Especiales</label>
                <textarea name="notes" rows="2" className="w-full p-2 border rounded-xl text-sm" placeholder="Dedicatoria, sabor de relleno, etc."></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsOrderModalOpen(false)} className="w-1/2 py-2.5 border rounded-xl text-slate-600 text-sm font-semibold">Cancelar</button>
                <button type="submit" className="w-1/2 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-bold">Guardar Pedido</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- UNIVERSAL PDF & PRINT MODAL COMPONENT --- */}
      {showInvoiceModal && pdfInvoiceData && (
        <InvoicePDFModal 
          pdfData={pdfInvoiceData} 
          settings={settings} 
          formatCurrency={formatWithCurrency}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
}

// --- AUXILIARY HELPER COMPONENTS ---

function NavItem({ id, icon, label, count, alert, activeTab, setActiveTab }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
        isActive 
          ? 'bg-pink-50 text-pink-700 font-bold' 
          : 'text-slate-600 hover:bg-amber-50/60 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={isActive ? 'text-pink-600' : 'text-slate-400'}>{icon}</span>
        <span>{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-pink-200 text-pink-800' : 'bg-slate-100 text-slate-600'}`}>
          {count}
        </span>
      )}
      {alert > 0 && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center gap-1">
          {alert}
        </span>
      )}
    </button>
  );
}

function KPICard({ title, value, subText, icon, bg, highlight }) {
  return (
    <div className={`p-5 rounded-2xl border ${highlight ? 'border-rose-300 bg-rose-50/40' : 'border-amber-100/80 bg-white'} shadow-sm flex items-start justify-between`}>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{subText}</p>
      </div>
      <div className={`p-3 rounded-xl ${bg}`}>
        {icon}
      </div>
    </div>
  );
}

function AIRecipeSearchModal({ ingredients, settings, onClose, onAddRecipe }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearchRecipe = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    setGeneratedRecipe(null);

    const ingredientListText = ingredients.map(i => `- ${i.name} (ID: ${i.id}, unidad: ${i.unit})`).join('\n');

    const systemInstruction = `Eres un experto pastelero y analista de costos. El usuario te pedirá una receta de repostería. 
Debes investigar en internet o usar tu conocimiento gastronómico para obtener una receta estándar y realista.
Luego, debes mapear los ingredientes requeridos usando EXCLUSIVAMENTE los IDs de la lista de ingredientes disponibles del usuario que te proporcionaré. Si un ingrediente necesario no está exacto, elige el más similar.

Debes responder ÚNICAMENTE con un objeto JSON válido (sin formato markdown adicional fuera del JSON) con esta estructura exacta:
{
  "name": "Nombre de la Receta",
  "category": "Pasteles / Tartas / Galletas / etc",
  "servings": 10,
  "prepTimeMinutes": 90,
  "marginPercent": ${settings.defaultMargin},
  "description": "Breve descripción apetitosos de la receta",
  "ingredients": [
    { "ingredientId": "ID_DEL_INGREDIENTE", "quantity": 250 }
  ]
}

Lista de ingredientes disponibles en el inventario del usuario:
${ingredientListText}`;

    const userQuery = `Busca y calcula la receta exacta para: ${searchTerm}`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }],
          tools: [{ "google_search": {} }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      const result = await response.json();
      const candidate = result.candidates?.[0];

      if (candidate && candidate.content?.parts?.[0]?.text) {
        const jsonText = candidate.content.parts[0].text;
        const parsed = JSON.parse(jsonText);
        setGeneratedRecipe(parsed);
      } else {
        setErrorMsg('No se pudo generar la receta. Intenta con otro nombre.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Ocurrió un error al buscar en internet. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 my-8">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900">Buscar Receta Automática (Internet AI)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
        </div>

        {!generatedRecipe ? (
          <form onSubmit={handleSearchRecipe} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">¿Qué receta deseas buscar?</label>
              <p className="text-xs text-slate-400 mb-2">Escribe el nombre de cualquier pastel, tarta, postre o galleta (ej: "Cheesecake de Frutos Rojos", "Alfajores de Maicena", "Torta Rogel").</p>
              <div className="flex gap-2">
                <input 
                  required 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="flex-1 p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" 
                  placeholder="Ej. Torta Chajá tradicional..." 
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Search className="w-4 h-4"/>}
                  {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            {isLoading && (
              <div className="text-center py-8 space-y-2">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-500 font-medium">Buscando en la web y calculando proporciones con tus ingredientes...</p>
              </div>
            )}
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
              <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded uppercase">Receta Encontrada & Mapeada</span>
              <h4 className="font-bold text-lg text-slate-900">{generatedRecipe.name}</h4>
              <p className="text-xs text-slate-600">{generatedRecipe.description}</p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-2.5 rounded-xl border border-amber-100">
                <div>
                  <span className="text-slate-400 block">Porciones</span>
                  <span className="font-bold text-slate-800">{generatedRecipe.servings}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tiempo</span>
                  <span className="font-bold text-slate-800">{generatedRecipe.prepTimeMinutes} min</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Margen</span>
                  <span className="font-bold text-pink-600">{generatedRecipe.marginPercent}%</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700">Ingredientes detectados en tu inventario:</p>
                <div className="max-h-36 overflow-y-auto space-y-1 bg-white p-2 rounded-xl border border-slate-100 text-xs">
                  {generatedRecipe.ingredients.map((item, idx) => {
                    const ingObj = ingredients.find(i => i.id === item.ingredientId);
                    return (
                      <div key={idx} className="flex justify-between text-slate-700 py-0.5">
                        <span>• {ingObj ? ingObj.name : 'Ingrediente'}</span>
                        <span className="font-bold">{item.quantity} {ingObj ? ingObj.unit : ''}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setGeneratedRecipe(null)} 
                className="w-1/2 py-2.5 border rounded-xl text-slate-600 text-sm font-semibold"
              >
                Buscar Otra
              </button>
              <button 
                type="button" 
                onClick={() => onAddRecipe({ ...generatedRecipe, id: 'rec_' + Date.now() })} 
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm"
              >
                Guardar en Mis Recetas ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RecipeModalForm({ editingRec, ingredients, settings, onClose, onSave, formatCurrency }) {
  const [name, setName] = useState(editingRec?.name || '');
  const [category, setCategory] = useState(editingRec?.category || 'Pasteles Integrales');
  const [servings, setServings] = useState(editingRec?.servings || 10);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(editingRec?.prepTimeMinutes || 60);
  const [marginPercent, setMarginPercent] = useState(editingRec?.marginPercent || settings.defaultMargin);
  const [description, setDescription] = useState(editingRec?.description || '');
  const [recipeIngredients, setRecipeIngredients] = useState(editingRec?.ingredients || []);

  const addIngredientRow = () => {
    if (ingredients.length === 0) return;
    setRecipeIngredients([...recipeIngredients, { ingredientId: ingredients[0].id, quantity: 100 }]);
  };

  const removeIngredientRow = (index) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index));
  };

  const updateIngredientRow = (index, field, value) => {
    const updated = [...recipeIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipeIngredients(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      category,
      servings: parseInt(servings) || 1,
      prepTimeMinutes: parseInt(prepTimeMinutes) || 0,
      marginPercent: parseFloat(marginPercent) || settings.defaultMargin,
      description,
      ingredients: recipeIngredients
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl space-y-4 my-8">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900">{editingRec ? 'Editar Receta' : 'Nueva Receta / Producto'}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Producto / Receta</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm" placeholder="Ej. Torta Selva Negra 22cm" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm" placeholder="Pasteles, Galletas..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Porciones</label>
              <input required type="number" min="1" value={servings} onChange={(e) => setServings(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tiempo (min)</label>
              <input required type="number" min="0" value={prepTimeMinutes} onChange={(e) => setPrepTimeMinutes(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Margen de Ganancia %</label>
              <input required type="number" min="1" max="99" value={marginPercent} onChange={(e) => setMarginPercent(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción Breve</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 border rounded-xl text-sm" placeholder="Sabor, tamaño..." />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Ingredientes & Empaques requeridos</label>
              <button type="button" onClick={addIngredientRow} className="text-xs text-pink-600 font-bold hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5"/> Añadir Insumo
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto p-1">
              {recipeIngredients.map((row, idx) => {
                const selectedIng = ingredients.find(i => i.id === row.ingredientId);
                return (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 text-xs">
                    <select 
                      value={row.ingredientId} 
                      onChange={(e) => updateIngredientRow(idx, 'ingredientId', e.target.value)}
                      className="flex-1 p-1.5 border rounded-lg bg-white"
                    >
                      {ingredients.map(ing => (
                        <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                      ))}
                    </select>

                    <input 
                      type="number" 
                      step="0.01" 
                      min="0.01"
                      value={row.quantity} 
                      onChange={(e) => updateIngredientRow(idx, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-20 p-1.5 border rounded-lg bg-white text-center font-bold" 
                    />
                    <span className="text-slate-500 text-[11px] min-w-[28px]">{selectedIng ? selectedIng.unit : ''}</span>

                    <button type="button" onClick={() => removeIngredientRow(idx)} className="p-1 text-slate-400 hover:text-rose-600">
                      <X className="w-4 h-4"/>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="w-1/2 py-2.5 border rounded-xl text-slate-600 text-sm font-semibold">Cancelar</button>
            <button type="submit" className="w-1/2 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-bold">Guardar Receta</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InvoicePDFModal({ pdfData, settings, formatCurrency, onClose }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-pink-600" />
            <h3 className="font-bold text-slate-900">Documento de Cotización / Pedido</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint} 
              className="px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4"/> Imprimir / Guardar en PDF
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8" id="printable-pdf-area" ref={printRef}>
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-pdf-area, #printable-pdf-area * {
                visibility: visible;
              }
              #printable-pdf-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 20px;
                box-shadow: none !important;
                border: none !important;
              }
            }
          `}</style>

          <div className="border border-amber-200/80 rounded-2xl p-6 bg-amber-50/10 space-y-6 shadow-sm">
            <div className="flex justify-between items-start border-b border-amber-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold">
                    <Cake className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">{settings.businessName}</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">Repostería & Pastelería Artesanal</p>
                <div className="text-xs text-slate-600 space-y-0.5 mt-2">
                  <p>📱 WhatsApp: {settings.phone}</p>
                  <p>✉️ Email: {settings.email}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-pink-100 text-pink-800 font-extrabold text-xs rounded-lg uppercase tracking-wider mb-2">
                  {pdfData.title || 'PRESUPUESTO'}
                </span>
                <p className="text-xs font-bold text-slate-700">Comprobante N°: <span className="text-pink-600">{pdfData.docNumber}</span></p>
                <p className="text-xs text-slate-500 mt-0.5">Fecha de Emisión: {pdfData.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs border border-slate-100">
              <div>
                <span className="text-slate-400 font-bold uppercase block mb-1">Datos del Cliente:</span>
                <p className="font-bold text-slate-800 text-sm">{pdfData.customerName}</p>
                {pdfData.customerPhone && <p className="text-slate-600 mt-0.5">{pdfData.customerPhone}</p>}
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase block mb-1">Detalles de Entrega:</span>
                <p className="font-bold text-slate-800">Fecha solicitada: <span className="text-pink-600">{pdfData.deliveryDate}</span></p>
                {pdfData.status && (
                  <p className="text-slate-600 mt-0.5">Estado: <span className="font-semibold text-slate-700">{pdfData.status}</span></p>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-700 uppercase font-bold bg-slate-50">
                    <th className="py-2.5 px-3">Descripción de Producto / Servicio</th>
                    <th className="py-2.5 px-3 text-center">Cant.</th>
                    <th className="py-2.5 px-3 text-right">P. Unitario</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pdfData.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-semibold text-slate-800">{item.description}</td>
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">{item.quantity}</td>
                      <td className="py-3 px-3 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-200 pt-4 flex justify-end">
              <div className="w-full max-w-xs space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal General:</span>
                  <span className="font-semibold">{formatCurrency(pdfData.subtotal)}</span>
                </div>

                {pdfData.depositPaid > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Seña / Anticipo Abonado:</span>
                    <span>- {formatCurrency(pdfData.depositPaid)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-300 pt-2">
                  <span>Monto Total:</span>
                  <span className="text-pink-600 text-base">{formatCurrency(pdfData.totalAmount)}</span>
                </div>

                {pdfData.balanceDue !== undefined && (
                  <div className="flex justify-between text-xs font-bold text-slate-800 bg-amber-100/70 p-2 rounded-lg mt-1">
                    <span>Saldo Restante a Cancelar:</span>
                    <span className="text-rose-600">{formatCurrency(pdfData.balanceDue)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-4 text-[11px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">Notas & Condiciones:</p>
              <p className="italic">{pdfData.notes}</p>
              <div className="pt-4 text-center text-[10px] text-slate-400 font-medium">
                ¡Gracias por elegir {settings.businessName}! Hecho con ❤ para tus momentos especiales.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}