const API_URL = "http://localhost:4000/api";

function setAuth(token, user) { localStorage.setItem("token", token); localStorage.setItem("user", JSON.stringify(user)); }
function getToken() { return localStorage.getItem("token"); }
function getUser() { const u = localStorage.getItem("user"); return u ? JSON.parse(u) : null; }
function headers(auth=false) { const h = { "Content-Type":"application/json" }; if(auth) h["Authorization"]=`Bearer ${getToken()}`; return h; }

async function register(){ const name=document.getElementById("reg_name").value; const email=document.getElementById("reg_email").value; const password=document.getElementById("reg_password").value; const role=document.getElementById("reg_role").value; const el=document.getElementById("reg_msg"); try{ const res=await fetch(`${API_URL}/auth/register`,{method:'POST',headers:headers(),body:JSON.stringify({name,email,password,role})}); const data=await res.json(); if(!res.ok) throw new Error(data.message||'Error'); el.textContent='Registro correcto'; el.className='small success'; }catch(e){ el.textContent=e.message; el.className='small error'; } }

async function login(){ const email=document.getElementById("log_email").value; const password=document.getElementById("log_password").value; const el=document.getElementById("log_msg"); try{ const res=await fetch(`${API_URL}/auth/login`,{method:'POST',headers:headers(),body:JSON.stringify({email,password})}); const data=await res.json(); if(!res.ok) throw new Error(data.message||'Credenciales inválidas'); setAuth(data.token,data.user); el.textContent=`Bienvenido ${data.user.name}`; el.className='small success'; }catch(e){ el.textContent=e.message; el.className='small error'; } }

async function apiCrearSolicitud(productName, quantity, details){ const res=await fetch(`${API_URL}/requests`,{method:'POST',headers:headers(true),body:JSON.stringify({productName,quantity,details})}); const data=await res.json(); if(!res.ok) throw new Error(data.message||'Error'); return data; }
async function apiMisSolicitudes(){ const res=await fetch(`${API_URL}/requests/mine`,{headers:headers(true)}); const data=await res.json(); if(!res.ok) throw new Error(data.message||'Error'); return data; }
async function apiSolicitudesAbiertas(){ const res=await fetch(`${API_URL}/requests/open`,{headers:headers(true)}); const data=await res.json(); if(!res.ok) throw new Error(data.message||'Error'); return data; }
async function apiCrearOferta(requestId, price){ const res=await fetch(`${API_URL}/offers`,{method:'POST',headers:headers(true),body:JSON.stringify({requestId,price})}); const data=await res.json(); if(!res.ok) throw new Error(data.message||'Error'); return data; }
async function apiDecisionOferta(offerId, action, price){ const body = price ? {action, price: Number(price)} : {action}; const res=await fetch(`${API_URL}/offers/${offerId}/decision`,{method:'POST',headers:headers(true),body:JSON.stringify(body)}); const data=await res.json(); if(!res.ok) throw new Error(data.message||'Error'); return data; }
async function apiContraofertaProveedor(offerId, price){ const res=await fetch(`${API_URL}/offers/${offerId}/counter`,{method:'POST',headers:headers(true),body:JSON.stringify({price: Number(price)})}); const data=await res.json(); if(!res.ok) throw new Error(data.message||'Error'); return data; }
async function apiListOffersByRequest(requestId){ const res=await fetch(`${API_URL}/offers/request/${requestId}`,{headers:headers(true)}); const data=await res.json(); if(!res.ok) throw new Error(data.message||'Error'); return data; }
async function apiListAccepted(){ const res=await fetch(`${API_URL}/offers/accepted`,{headers:headers(true)}); const data=await res.json(); if(!res.ok) throw new Error(data.message||'Error'); return data; }
