import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PlusCircle, Edit, Trash2, ShoppingCart, DollarSign, Users, TrendingUp, Archive, AlertTriangle, CheckCircle, XCircle, LogIn, LogOut, Lock } from 'lucide-react';

// --- DADOS DE USUÁRIOS E PERMISSÕES (SIMULAÇÃO) ---
const users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' },
    { id: 2, username: 'vendas', password: 'vendas123', role: 'sales', name: 'Funcionária Vendas' },
    { id: 3, username: 'financeiro', password: 'financeiro123', role: 'financial', name: 'Funcionária Financeiro' },
];

const rolesConfig = {
    admin: ['dashboard', 'sales', 'dishes', 'ingredients', 'financials', 'clients'],
    sales: ['sales'],
    financial: ['financials'],
};

// --- DADOS INICIAIS (EXEMPLOS PARA COMEÇAR) ---
const initialIngredients = [
  { id: 1, name: 'Arroz Agulhinha', category: 'Grãos', unit: 'Kg', provider: 'Mercadão do Zé', cost: 4.50, stock: 12, minStock: 5 },
  { id: 2, name: 'Coxão Mole', category: 'Carnes', unit: 'Kg', provider: 'Açougue Bom Bife', cost: 38.00, stock: 1.5, minStock: 2 },
  { id: 3, name: 'Tomate Italiano', category: 'Hortifruti', unit: 'Kg', provider: 'Sítio Feliz', cost: 7.90, stock: 3, minStock: 1 },
  { id: 4, name: 'Frango Inteiro', category: 'Carnes', unit: 'Kg', provider: 'Açougue Bom Bife', cost: 12.00, stock: 8, minStock: 3 },
  { id: 5, name: 'Batata Inglesa', category: 'Hortifruti', unit: 'Kg', provider: 'Sítio Feliz', cost: 5.00, stock: 10, minStock: 4 },
  { id: 6, name: 'Laranja Pera', category: 'Hortifruti', unit: 'Kg', provider: 'Sítio Feliz', cost: 3.50, stock: 4, minStock: 2 },
  { id: 7, name: 'Linguiça Toscana', category: 'Carnes', unit: 'Kg', provider: 'Açougue Bom Bife', cost: 18.00, stock: 5, minStock: 2 },
  { id: 8, name: 'Embalagem Marmita G', category: 'Descartáveis', unit: 'Un', provider: 'Embalagens & Cia', cost: 0.80, stock: 150, minStock: 50 },
  { id: 9, name: 'Feijão Carioca', category: 'Grãos', unit: 'Kg', provider: 'Mercadão do Zé', cost: 8.00, stock: 7, minStock: 3 },
];

const initialDishes = [
  { id: 1, name: 'Frango Assado Marinado na Laranja', recipe: [ { ingredientId: 4, quantity: 1.2 }, { ingredientId: 6, quantity: 0.3 }, ], salePrice: 45.00 },
  { id: 2, name: 'Marmita G', recipe: [ { ingredientId: 1, quantity: 0.200 }, { ingredientId: 9, quantity: 0.150 }, { ingredientId: 2, quantity: 0.120 }, { ingredientId: 8, quantity: 1 }, ], salePrice: 22.00 },
];

const initialFinancials = [
    {id: 1, date: new Date().toISOString().split('T')[0], description: 'Aluguel do Mês', type: 'expense', category: 'Custo Fixo', amount: 2500.00, status: 'pending'},
    {id: 2, date: new Date().toISOString().split('T')[0], description: 'Conta de Luz', type: 'expense', category: 'Custo Fixo', amount: 450.00, status: 'pending'},
    {id: 3, date: '2025-06-15', description: 'Nota semanal Empresa X', type: 'revenue', category: 'Venda a Prazo', amount: 450.00, status: 'pending'},
];

const initialClients = [
    {id: 1, name: 'Empresa X', contact: 'financeiro@empresaX.com', balance: 450.00},
    {id: 2, name: 'Sr. Carlos', contact: 'Vizinho do 301', balance: 88.00},
];


// --- COMPONENTES AUXILIARES (MODAIS, BOTÕES, ETC) ---

const Modal = ({ children, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button onClick={onClose} className="modal-close-button"> <XCircle size={24} /> </button>
      {children}
    </div>
  </div>
);

const Card = ({ children, className }) => ( <div className={`card ${className || ''}`}> {children} </div> );


// --- COMPONENTES DOS MÓDULOS (Dashboard, Estoque, Vendas, etc.) ---
const IngredientManager = ({ ingredients, setIngredients }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [purchaseIngredient, setPurchaseIngredient] = useState(null);

    const handleOpenModal = (ingredient = null) => { setEditingIngredient(ingredient); setIsModalOpen(true); };
    const handleSave = (ingredientData) => { setIngredients(prev => editingIngredient ? prev.map(ing => ing.id === editingIngredient.id ? { ...ing, ...ingredientData } : ing) : [...prev, { ...ingredientData, id: Date.now(), stock: ingredientData.stock || 0 }]); setIsModalOpen(false); };
    const handleDelete = (id) => { if(window.confirm('Tem certeza que quer apagar este ingrediente?')) { setIngredients(prev => prev.filter(ing => ing.id !== id)); } };
    const handleOpenPurchaseModal = (ingredient) => { setPurchaseIngredient(ingredient); setIsPurchaseModalOpen(true); };
    const handleRegisterPurchase = (purchaseData) => { setIngredients(prev => prev.map(ing => ing.id === purchaseIngredient.id ? { ...ing, stock: parseFloat(ing.stock) + parseFloat(purchaseData.quantity), cost: parseFloat(purchaseData.newCost) } : ing )); setIsPurchaseModalOpen(false); };

    return ( <div> <div className="header-container"> <h2>Estoque de Ingredientes</h2> <button onClick={() => handleOpenModal()} className="btn btn-primary"> <PlusCircle size={20} /> Novo Ingrediente </button> </div> <div className="table-container"> <table> <thead> <tr> {['Ingrediente', 'Custo Unitário', 'Estoque Atual', 'Estoque Mínimo', 'Status', 'Ações'].map(h => <th key={h}>{h}</th>)} </tr> </thead> <tbody> {ingredients.sort((a,b) => a.name.localeCompare(b.name)).map(ing => { const isLowStock = ing.stock <= ing.minStock; return ( <tr key={ing.id}> <td>{ing.name} <span className="category-text">{ing.category}</span></td> <td>R$ {ing.cost.toFixed(2)} / {ing.unit}</td> <td className="font-mono">{ing.stock.toFixed(2)} {ing.unit}</td> <td className="font-mono">{ing.minStock.toFixed(2)} {ing.unit}</td> <td> <span className={`status-badge ${isLowStock ? 'status-low' : 'status-ok'}`}> {isLowStock ? 'COMPRAR!' : 'OK'} </span> </td> <td className="actions-cell"> <button onClick={() => handleOpenPurchaseModal(ing)} className="icon-btn-cyan" title="Registrar Compra"><ShoppingCart size={18} /></button> <button onClick={() => handleOpenModal(ing)} className="icon-btn-yellow" title="Editar"><Edit size={18} /></button> <button onClick={() => handleDelete(ing.id)} className="icon-btn-red" title="Apagar"><Trash2 size={18} /></button> </td> </tr> ); })} </tbody> </table> </div> {isModalOpen && ( <Modal onClose={() => setIsModalOpen(false)}> <IngredientForm ingredient={editingIngredient} onSave={handleSave} onCancel={() => setIsModalOpen(false)} /> </Modal> )} {isPurchaseModalOpen && ( <Modal onClose={() => setIsPurchaseModalOpen(false)}> <PurchaseForm ingredient={purchaseIngredient} onRegister={handleRegisterPurchase} onCancel={() => setIsPurchaseModalOpen(false)} /> </Modal> )} </div> );
};
const IngredientForm = ({ ingredient, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ name: ingredient?.name || '', category: ingredient?.category || '', unit: ingredient?.unit || 'Kg', provider: ingredient?.provider || '', cost: ingredient?.cost || '', minStock: ingredient?.minStock || '', stock: ingredient?.stock || 0 });
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return ( <form onSubmit={handleSubmit} className="modal-form"> <h3>{ingredient ? 'Editar Ingrediente' : 'Novo Ingrediente'}</h3> <div className="form-grid-2"> <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome do Ingrediente" className="form-input" required /> <input name="category" value={formData.category} onChange={handleChange} placeholder="Categoria (Ex: Carnes, Hortifruti)" className="form-input" /> </div> <div className="form-grid-3"> <input name="cost" type="number" step="0.01" value={formData.cost} onChange={handleChange} placeholder="Custo Unitário (R$)" className="form-input" required /> <select name="unit" value={formData.unit} onChange={handleChange} className="form-select"> <option>Kg</option> <option>Un</option> <option>L</option> <option>g</option> </select> <input name="minStock" type="number" step="0.01" value={formData.minStock} onChange={handleChange} placeholder="Estoque Mínimo" className="form-input" required /> </div> <input name="provider" value={formData.provider} onChange={handleChange} placeholder="Fornecedor Padrão" className="form-input" /> <div className="form-actions"> <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button> <button type="submit" className="btn btn-primary">Salvar</button> </div> </form> );
};
const PurchaseForm = ({ ingredient, onRegister, onCancel }) => {
    const [quantity, setQuantity] = useState(''); const [newCost, setNewCost] = useState(ingredient.cost);
    const handleSubmit = (e) => { e.preventDefault(); onRegister({ quantity, newCost }); };
    return ( <form onSubmit={handleSubmit} className="modal-form"> <h3 className="form-title-h3">Registrar Compra</h3> <p className="form-subtitle">para <span className="text-cyan">{ingredient.name}</span></p> <div className="form-group"> <label className="form-label">Quantidade Comprada ({ingredient.unit})</label> <input type="number" step="0.01" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="form-input" required /> </div> <div className="form-group"> <label className="form-label">Novo Custo Unitário (R$)</label> <input type="number" step="0.01" value={newCost} onChange={(e) => setNewCost(e.target.value)} className="form-input" required /> <p className="form-help-text">O custo atual é R$ {ingredient.cost.toFixed(2)}. Atualize se o preço mudou.</p> </div> <div className="form-actions"> <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button> <button type="submit" className="btn btn-primary">Registrar Compra</button> </div> </form> );
};

const DishManager = ({ dishes, setDishes, ingredients }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); const [editingDish, setEditingDish] = useState(null);
    const getCost = useCallback((recipe) => { return recipe.reduce((total, item) => { const ingredient = ingredients.find(ing => ing.id === item.ingredientId); return total + (ingredient ? ingredient.cost * item.quantity : 0); }, 0); }, [ingredients]);
    const handleOpenModal = (dish = null) => { setEditingDish(dish); setIsModalOpen(true); };
    const handleSave = (dishData) => { setDishes(prev => editingDish ? prev.map(d => d.id === editingDish.id ? { ...d, ...dishData } : d) : [...prev, { ...dishData, id: Date.now() }] ); setIsModalOpen(false); };
    const handleDelete = (id) => { if(window.confirm('Tem certeza que quer apagar este prato?')) { setDishes(prev => prev.filter(d => d.id !== id)); } };
    return ( <div> <div className="header-container"> <h2>Pratos e Fichas Técnicas</h2> <button onClick={() => handleOpenModal()} className="btn btn-primary"> <PlusCircle size={20} /> Novo Prato </button> </div> <div className="grid-container-3-cols"> {dishes.map(dish => { const cost = getCost(dish.recipe); const profit = dish.salePrice - cost; const margin = cost > 0 ? (profit / cost) * 100 : 0; return ( <Card key={dish.id}> <div className="dish-card-header"> <h3>{dish.name}</h3> <div className="actions-cell"> <button onClick={() => handleOpenModal(dish)} className="icon-btn-yellow"><Edit size={18} /></button> <button onClick={() => handleDelete(dish.id)} className="icon-btn-red"><Trash2 size={18} /></button> </div> </div> <div className="dish-card-body"> <p>Custo do Prato: <span className="text-red">R$ {cost.toFixed(2)}</span></p> <p>Preço de Venda: <span className="text-green">R$ {dish.salePrice.toFixed(2)}</span></p> <p>Lucro Bruto: <span className="text-white">R$ {profit.toFixed(2)} ({margin.toFixed(0)}%)</span></p> </div> <div className="dish-card-footer"> <h4>Ingredientes:</h4> <ul> {dish.recipe.map(item => { const ingredient = ingredients.find(i => i.id === item.ingredientId); return <li key={item.ingredientId}>{item.quantity} {ingredient?.unit || ''} de {ingredient?.name || 'Ingrediente apagado'}</li> })} </ul> </div> </Card> ) })} </div> {isModalOpen && ( <Modal onClose={() => setIsModalOpen(false)}> <DishForm dish={editingDish} onSave={handleSave} onCancel={() => setIsModalOpen(false)} ingredients={ingredients} getCost={getCost}/> </Modal> )} </div> );
};

const DishForm = ({ dish, onSave, onCancel, ingredients, getCost }) => {
    const [name, setName] = useState(dish?.name || ''); const [salePrice, setSalePrice] = useState(dish?.salePrice || ''); const [recipe, setRecipe] = useState(dish?.recipe || []); const [margin, setMargin] = useState(120);
    const handleAddIngredient = () => { setRecipe([...recipe, { ingredientId: ingredients[0]?.id || '', quantity: '' }]); };
    const handleRecipeChange = (index, field, value) => { const newRecipe = [...recipe]; newRecipe[index][field] = field === 'ingredientId' ? parseInt(value) : value; setRecipe(newRecipe); };
    const handleRemoveIngredient = (index) => { setRecipe(recipe.filter((_, i) => i !== index)); };
    const handleSubmit = (e) => { e.preventDefault(); onSave({ name, salePrice: parseFloat(salePrice), recipe }); };
    const cost = getCost(recipe); const suggestedPrice = cost * (1 + margin / 100);
    return ( <form onSubmit={handleSubmit} className="modal-form"> <h3>{dish ? 'Editar Prato' : 'Novo Prato'}</h3> <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome do Prato" className="form-input" required /> <div> <h4 className="form-label">Ficha Técnica (Ingredientes)</h4> <div className="recipe-list"> {recipe.map((item, index) => ( <div key={index} className="recipe-item"> <select value={item.ingredientId} onChange={e => handleRecipeChange(index, 'ingredientId', e.target.value)} className="form-select"> {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)} </select> <input type="number" step="0.001" value={item.quantity} onChange={e => handleRecipeChange(index, 'quantity', e.target.value)} placeholder="Qtd" className="form-input recipe-quantity-input" required /> <button type="button" onClick={() => handleRemoveIngredient(index)} className="icon-btn-red"><Trash2 size={18} /></button> </div> ))} </div> <button type="button" onClick={handleAddIngredient} className="btn-add-ingredient"> <PlusCircle size={16} /> Adicionar Ingrediente </button> </div> <div className="price-calculator"> <div> <label className="form-label">Custo Total do Prato</label> <p className="price-display text-red">R$ {cost.toFixed(2)}</p> </div> <div> <label className="form-label">Preço de Venda Praticado (R$)</label> <input type="number" step="0.01" value={salePrice} onChange={e => setSalePrice(e.target.value)} placeholder="Preço Final" className="form-input" required /> </div> <div className="margin-calculator"> <label className="form-label">Calcular Preço Sugerido com Margem</label> <div className="range-slider"> <input type="range" min="50" max="300" value={margin} onChange={e => setMargin(e.target.value)} /> <span>{margin}%</span> </div> <p>Preço Sugerido: <span className="text-green">R$ {suggestedPrice.toFixed(2)}</span></p> </div> </div> <div className="form-actions"> <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button> <button type="submit" className="btn btn-primary">Salvar Prato</button> </div> </form> );
};

const SalesTerminal = ({ dishes, ingredients, setIngredients, setFinancials }) => {
    const [cart, setCart] = useState([]);
    const addToCart = (dish) => { setCart(prev => { const existing = prev.find(item => item.id === dish.id); if (existing) { return prev.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item); } return [...prev, { ...dish, quantity: 1 }]; }); };
    const removeFromCart = (dishId) => { setCart(prev => prev.map(item => item.id === dishId ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0)); };
    const finalizeSale = () => { if (cart.length === 0) { alert("O carrinho está vazio!"); return; } let newIngredients = [...ingredients]; cart.forEach(item => { item.recipe.forEach(recipeItem => { const ingIndex = newIngredients.findIndex(ing => ing.id === recipeItem.ingredientId); if (ingIndex !== -1) { newIngredients[ingIndex].stock -= recipeItem.quantity * item.quantity; } }); }); setIngredients(newIngredients); const totalSale = cart.reduce((sum, item) => sum + item.salePrice * item.quantity, 0); const newTransaction = { id: Date.now(), date: new Date().toISOString().split('T')[0], description: `Venda do Dia #${Math.floor(Math.random() * 1000)}`, type: 'revenue', category: 'Venda Direta', amount: totalSale, status: 'completed', }; setFinancials(prev => [...prev, newTransaction]); alert(`Venda de R$ ${totalSale.toFixed(2)} finalizada com sucesso! Estoque atualizado.`); setCart([]); };
    const total = cart.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
    return ( <div className="sales-terminal-grid"> <div className="sales-dishes-grid"> <h2>Ponto de Venda (PDV)</h2> <div className="grid-container-4-cols"> {dishes.map(dish => ( <button key={dish.id} onClick={() => addToCart(dish)} className="dish-button"> <p>{dish.name}</p> <p className="dish-price">R$ {dish.salePrice.toFixed(2)}</p> </button> ))} </div> </div> <div className="sales-cart"> <h3>Carrinho</h3> <div className="cart-items"> {cart.length === 0 && <p className="cart-empty-message">Clique em um prato para adicionar.</p>} {cart.map(item => ( <div key={item.id} className="cart-item"> <div> <p>{item.name}</p> <p className="cart-item-price">R$ {item.salePrice.toFixed(2)}</p> </div> <div className="cart-item-controls"> <button onClick={() => removeFromCart(item.id)}>-</button> <span>{item.quantity}</span> <button onClick={() => addToCart(item)}>+</button> </div> </div> ))} </div> <div className="cart-summary"> <div className="cart-total"> <span>Total:</span> <span>R$ {total.toFixed(2)}</span> </div> <button onClick={finalizeSale} disabled={cart.length === 0} className="btn btn-success"> Finalizar Venda </button> </div> </div> </div> );
}

const FinancialManager = ({ financials, setFinancials, clients, setClients }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleSave = (data) => { setFinancials(prev => [...prev, { ...data, id: Date.now(), status: 'pending' }]); if (data.type === 'revenue' && data.category === 'Venda a Prazo' && data.clientId) { setClients(prev => prev.map(c => c.id === parseInt(data.clientId) ? { ...c, balance: c.balance + parseFloat(data.amount) } : c)); } setIsModalOpen(false); };
    const handleStatusChange = (id, newStatus) => { setFinancials(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f)); }
    const summary = useMemo(() => { const totalRevenue = financials.filter(f => f.type === 'revenue' && f.status !== 'canceled').reduce((sum, f) => sum + f.amount, 0); const totalExpense = financials.filter(f => f.type === 'expense' && f.status !== 'canceled').reduce((sum, f) => sum + f.amount, 0); const net = totalRevenue - totalExpense; return { totalRevenue, totalExpense, net }; }, [financials]);
    return ( <div> <div className="header-container"> <h2>Controle Financeiro</h2> <button onClick={() => setIsModalOpen(true)} className="btn btn-primary"> <PlusCircle size={20} /> Novo Lançamento </button> </div> <div className="grid-container-3-cols"> <Card><p>Receita Total</p><p className="text-3xl text-green">R$ {summary.totalRevenue.toFixed(2)}</p></Card> <Card><p>Despesa Total</p><p className="text-3xl text-red">R$ {summary.totalExpense.toFixed(2)}</p></Card> <Card><p>Saldo</p><p className={`text-3xl ${summary.net >= 0 ? 'text-white' : 'text-yellow'}`}>R$ {summary.net.toFixed(2)}</p></Card> </div> <div className="table-container"> <table> <thead > <tr> {['Data', 'Descrição', 'Tipo', 'Valor', 'Status', 'Ações'].map(h => <th key={h}>{h}</th>)} </tr> </thead> <tbody> {financials.sort((a,b) => new Date(b.date) - new Date(a.date)).map(f => ( <tr key={f.id}> <td>{new Date(f.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td> <td>{f.description} <span className="category-text">{f.category}</span></td> <td><span className={f.type === 'revenue' ? 'text-green' : 'text-red'}>{f.type === 'revenue' ? 'Receita' : 'Despesa'}</span></td> <td className="font-bold">R$ {f.amount.toFixed(2)}</td> <td> <span className={`status-badge ${ f.status === 'completed' ? 'status-ok' : f.status === 'pending' ? 'status-pending' : 'status-canceled' }`}>{f.status === 'completed' ? 'Pago/Recebido' : f.status === 'pending' ? 'Pendente' : 'Cancelado'}</span> </td> <td className="actions-cell"> {f.status === 'pending' && <button onClick={() => handleStatusChange(f.id, 'completed')} className="icon-btn-green" title="Marcar como Pago/Recebido"><CheckCircle size={18}/></button>} {f.status !== 'canceled' && <button onClick={() => handleStatusChange(f.id, 'canceled')} className="icon-btn-gray" title="Cancelar"><XCircle size={18}/></button>} </td> </tr> ))} </tbody> </table> </div> {isModalOpen && ( <Modal onClose={() => setIsModalOpen(false)}> <FinancialForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} clients={clients} /> </Modal> )} </div> );
};
const FinancialForm = ({ onSave, onCancel, clients }) => {
    const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], description: '', type: 'expense', category: '', amount: '', clientId: '' });
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return ( <form onSubmit={handleSubmit} className="modal-form"> <h3>Novo Lançamento Financeiro</h3> <div className="form-grid-2"> <input name="description" value={formData.description} onChange={handleChange} placeholder="Descrição (Ex: Compra de Gás)" className="form-input" required /> <input name="date" type="date" value={formData.date} onChange={handleChange} className="form-input" required /> </div> <div className="form-grid-3"> <select name="type" value={formData.type} onChange={handleChange} className="form-select"> <option value="expense">Despesa</option> <option value="revenue">Receita</option> </select> <input name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} placeholder="Valor (R$)" className="form-input" required /> <input name="category" value={formData.category} onChange={handleChange} placeholder="Categoria (Ex: Custo Fixo)" className="form-input" required /> </div> {formData.type === 'revenue' && formData.category === 'Venda a Prazo' && ( <div className="form-group"> <label className="form-label">Cliente</label> <select name="clientId" value={formData.clientId} onChange={handleChange} className="form-select"> <option value="">Selecione um cliente</option> {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)} </select> </div> )} <div className="form-actions"> <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button> <button type="submit" className="btn btn-primary">Salvar</button> </div> </form> );
};

const ClientManager = ({ clients, setClients }) => {
    return ( <div> <h2 className="header-container">Clientes (Contas a Receber)</h2> <div className="table-container"> <table> <thead> <tr> {['Nome', 'Contato', 'Saldo Devedor (R$)'].map(h => <th key={h}>{h}</th>)} </tr> </thead> <tbody> {clients.map(c => ( <tr key={c.id}> <td>{c.name}</td> <td className="text-gray">{c.contact}</td> <td className="text-yellow font-bold">R$ {c.balance.toFixed(2)}</td> </tr> ))} </tbody> </table> </div> </div> );
};

const Dashboard = ({ ingredients, financials, dishes }) => {
    const lowStockItems = ingredients.filter(i => i.stock <= i.minStock);
    const pendingFinancials = financials.filter(f => f.status === 'pending' && new Date(f.date) <= new Date());
    const summary = useMemo(() => { const totalRevenue = financials.filter(f => f.type === 'revenue' && f.status === 'completed').reduce((sum, f) => sum + f.amount, 0); const totalExpense = financials.filter(f => f.type === 'expense' && f.status === 'completed').reduce((sum, f) => sum + f.amount, 0); return { totalRevenue, totalExpense, net: totalRevenue - totalExpense }; }, [financials]);
    return ( <div> <h2 className="header-container">Dashboard - Restaurante JB</h2> <div className="grid-container-4-cols"> <Card><p>Receita (Mês)</p><p className="text-3xl text-green">R$ {summary.totalRevenue.toFixed(2)}</p></Card> <Card><p>Despesa (Mês)</p><p className="text-3xl text-red">R$ {summary.totalExpense.toFixed(2)}</p></Card> <Card><p>Itens em Estoque</p><p className="text-3xl text-white">{ingredients.length}</p></Card> <Card><p>Pratos Cadastrados</p><p className="text-3xl text-white">{dishes.length}</p></Card> </div> <div className="dashboard-grid-2-cols"> <Card> <h3 className="alert-header"><AlertTriangle className="text-yellow"/> Alertas</h3> <div className="alert-list"> {lowStockItems.length === 0 && pendingFinancials.length === 0 && <p className="text-gray">Nenhum alerta no momento.</p>} {lowStockItems.length > 0 && lowStockItems.map(i => ( <div key={i.id} className="alert-item"> <p className="text-yellow">Estoque baixo: {i.name}</p> <p>Atual: {i.stock.toFixed(2)} {i.unit} / Mínimo: {i.minStock.toFixed(2)} {i.unit}</p> </div> ))} {pendingFinancials.length > 0 && lowStockItems.length > 0 && <div className="divider"></div>} {pendingFinancials.length > 0 && pendingFinancials.map(f => ( <div key={f.id} className="alert-item"> <p className="text-red">Vencido: {f.description}</p> <p>Valor: R$ {f.amount.toFixed(2)} - Venceu em: {new Date(f.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p> </div> ))} </div> </Card> <Card> <h3>Acesso Rápido</h3> <div> <p className="text-gray">Use o menu à esquerda para navegar entre os módulos.</p> </div> </Card> </div> </div> );
};

const LoginScreen = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            onLogin(user);
        } else {
            setError('Usuário ou senha inválidos.');
        }
    };

    return (
        <div className="login-screen">
            <div className="login-card">
                <div className="login-icon-container">
                    <span className="login-icon"><DollarSign size={32}/></span>
                </div>
                <h2>Gestão JB</h2>
                <p>Por favor, faça o login para continuar.</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="form-input"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="form-input"
                    />
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="btn btn-primary">
                        <LogIn size={20} /> Entrar
                    </button>
                </form>
            </div>
             <div className="login-test-users">
                <p>Usuários de Teste:</p>
                <p>Admin: admin / admin123</p>
                <p>Vendas: vendas / vendas123</p>
                <p>Financeiro: financeiro / financeiro123</p>
            </div>
        </div>
    );
};

export default function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [activeView, setActiveView] = useState('dashboard');
    
    const [ingredients, setIngredients] = useState(initialIngredients);
    const [dishes, setDishes] = useState(initialDishes);
    const [financials, setFinancials] = useState(initialFinancials);
    const [clients, setClients] = useState(initialClients);

    const handleLogin = (user) => {
        setCurrentUser(user);
        const userRoles = rolesConfig[user.role];
        setActiveView(userRoles[0]);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    if (!currentUser) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    const allMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
        { id: 'sales', label: 'Vendas (PDV)', icon: ShoppingCart },
        { id: 'dishes', label: 'Pratos (Fichas)', icon: Archive },
        { id: 'ingredients', label: 'Estoque', icon: Archive },
        { id: 'financials', label: 'Financeiro', icon: DollarSign },
        { id: 'clients', label: 'Clientes', icon: Users },
    ];

    const allowedViews = rolesConfig[currentUser.role];
    const menuItems = allMenuItems.filter(item => allowedViews.includes(item.id));

    const renderView = () => {
        if (!allowedViews.includes(activeView)) {
            return <div className="access-denied"><h2>Acesso Negado</h2><p>Você não tem permissão para ver esta página.</p></div>;
        }
        switch(activeView) {
            case 'dashboard': return <Dashboard ingredients={ingredients} financials={financials} dishes={dishes} />;
            case 'ingredients': return <IngredientManager ingredients={ingredients} setIngredients={setIngredients} />;
            case 'dishes': return <DishManager dishes={dishes} setDishes={setDishes} ingredients={ingredients} />;
            case 'sales': return <SalesTerminal dishes={dishes} ingredients={ingredients} setIngredients={setIngredients} setFinancials={setFinancials} />;
            case 'financials': return <FinancialManager financials={financials} setFinancials={setFinancials} clients={clients} setClients={setClients}/>;
            case 'clients': return <ClientManager clients={clients} setClients={setClients} />;
            default: return <Dashboard ingredients={ingredients} financials={financials} dishes={dishes} />;
        }
    };
    
    return (
        <div className="app-container">
            <nav className="sidebar">
                <div className="sidebar-header">
                    <span className="sidebar-icon"><Lock size={20} /></span>
                    <h1>Gestão JB</h1>
                </div>
                <div className="user-info">
                    <p>Bem-vindo(a),</p>
                    <p className="user-name">{currentUser.name}</p>
                </div>
                {menuItems.map(item => (
                    <button key={item.id} 
                            onClick={() => setActiveView(item.id)}
                            className={`sidebar-button ${activeView === item.id ? 'active' : ''}`}>
                        <item.icon size={20} />
                        {item.label}
                    </button>
                ))}
                <button onClick={handleLogout} className="sidebar-button logout-button">
                    <LogOut size={20} /> Sair
                </button>
                <div className="sidebar-footer-note">
                    <p><strong>Atenção:</strong> Este é um protótipo. Os dados <strong>não são salvos</strong> se a página for recarregada.</p>
                </div>
            </nav>
            
            <main className="main-content">
                {renderView()}
            </main>
        </div>
    );
}
