// Mano Firme · Alquiler de herramientas — demo de Varyon.
// Todo corre en el navegador: el estado se guarda en localStorage y se reinicia desde la barra superior.
const CASO_URL = "https://varyon.com.ar/proyectos/alquiler"; // caso de estudio en la web de Varyon
const KEY = "manofirme-demo-v1";
const $app = document.getElementById("app");
const $modal = document.getElementById("modal");
const $toast = document.getElementById("toast");

// ---------- Utilidades ----------
const DIA = 86400000;
const hoy = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const fecha = (s) => new Date(s + "T00:00:00");
const sumarDias = (s, n) => iso(new Date(fecha(s).getTime() + n * DIA));
const diasEntre = (a, b) => Math.round((fecha(b) - fecha(a)) / DIA);
const fmt = (n) => "$ " + Math.round(n).toLocaleString("es-AR");
const fmtFecha = (s) => fecha(s).toLocaleDateString("es-AR", { day: "2-digit", month: "short" }).replace(".", "");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const cat = (id) => CATEGORIAS.find((c) => c.id === id);
const cli = (id) => S.clientes.find((c) => c.id === id);
const eq = (id) => S.equipos.find((e) => e.id === id);

const I = {
  logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 19l7.5-7.5M14.7 6.3a4 4 0 0 0 5 5l1.3 1.3-2.8 2.8-1.3-1.3a4 4 0 0 1-5-5"/></svg>',
  panel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  equipos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"/></svg>',
  nuevo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M12 12v6M9 15h6"/></svg>',
  contratos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  clientes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M17 4a4 4 0 0 1 0 8M22 21a6 6 0 0 0-4-5.6"/></svg>',
  tool: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/></svg>',
};

// ---------- Estado inicial ----------
function semilla() {
  const t = iso(hoy());
  const equipos = EQUIPOS.map(([id, nombre, marca, c, tarifa, valor]) => ({ id, nombre, marca, cat: c, tarifa, valor, estado: "disponible" }));
  const clientes = CLIENTES.map(([id, nombre, doc, tel, nivel]) => ({ id, nombre, doc, tel, nivel }));
  const S0 = { equipos, clientes, contratos: [], seq: 140, historico: [] };
  const crear = (clienteId, items, inicio, dias, metodo) => {
    const tarifaDia = items.reduce((a, id) => a + equipos.find((e) => e.id === id).tarifa, 0);
    const valor = items.reduce((a, id) => a + equipos.find((e) => e.id === id).valor, 0);
    const nivel = NIVELES[clientes.find((c) => c.id === clienteId).nivel];
    const c = { id: "k" + S0.seq, num: "C-0" + S0.seq++, clienteId, items, inicio, fin: sumarDias(inicio, dias), dias, tarifaDia, subtotal: tarifaDia * dias, garantia: Math.round(valor * nivel.garantia / 100) * 100, metodo, estado: "activo" };
    items.forEach((id) => (equipos.find((e) => e.id === id).estado = "alquilado"));
    S0.contratos.push(c);
    return c;
  };
  const cerrado = crear("c2", ["e05"], sumarDias(t, -12), 3, "Efectivo");
  cerrado.estado = "cerrado";
  cerrado.devolucion = { fecha: sumarDias(t, -8), mora: 5200, danios: [{ eqId: "e05", monto: 18000, desc: "Disco y protector rotos" }] };
  cerrado.devolucion.garantiaDevuelta = Math.max(0, cerrado.garantia - 18000);
  equipos.find((e) => e.id === "e05").estado = "disponible";
  crear("c5", ["e17"], sumarDias(t, -9), 2, "Transferencia");
  const k2 = S0.contratos[1]; k2.estado = "cerrado"; k2.devolucion = { fecha: k2.fin, mora: 0, danios: [], garantiaDevuelta: k2.garantia }; equipos.find((e) => e.id === "e17").estado = "disponible";
  crear("c1", ["e04", "e09", "e10"], sumarDias(t, -5), 7, "Transferencia");
  crear("c3", ["e15"], sumarDias(t, -6), 3, "Débito");
  crear("c4", ["e06", "e07"], sumarDias(t, -4), 4, "Efectivo");
  crear("c6", ["e12", "e16"], sumarDias(t, -1), 2, "Crédito");
  equipos.find((e) => e.id === "e18").estado = "reparacion";
  // Ingresos de los 5 meses anteriores (simulados)
  S0.historico = [612000, 748500, 691000, 905400, 842300];
  return S0;
}
let S = cargar();
function cargar() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.equipos) return s; } catch (e) {} return semilla(); }
function guardar() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

let vista = (location.hash || "#panel").slice(1);
let filtroCat = "todas", busqueda = "", filtroContratos = "activos";
let borrador = { clienteId: "c3", items: [], inicio: iso(hoy()), dias: 3, metodo: "Efectivo" };

// ---------- Cálculos ----------
const estadoContrato = (c) => {
  if (c.estado === "cerrado") return { t: "Cerrado", cls: "b-mute" };
  const r = diasEntre(iso(hoy()), c.fin);
  if (r < 0) return { t: `Vencido hace ${-r} ${-r === 1 ? "día" : "días"}`, cls: "b-danger", vencido: true };
  if (r === 0) return { t: "Vence hoy", cls: "b-warn" };
  return { t: `Vence en ${r} ${r === 1 ? "día" : "días"}`, cls: "b-info" };
};
const vencidos = () => S.contratos.filter((c) => estadoContrato(c).vencido);
const ingresoMes = () => {
  const m = iso(hoy()).slice(0, 7);
  return S.contratos.reduce((a, c) => a + (c.inicio.slice(0, 7) === m ? c.subtotal : 0) + (c.devolucion && c.devolucion.fecha.slice(0, 7) === m ? c.devolucion.mora : 0), 0) + 318000;
};
const activosDe = (clienteId) => S.contratos.filter((c) => c.clienteId === clienteId && c.estado === "activo").reduce((a, c) => a + c.items.length, 0);

// ---------- Render ----------
const NAV = [["panel", "Panel"], ["equipos", "Equipos"], ["nuevo", "Nuevo contrato"], ["contratos", "Contratos"], ["clientes", "Clientes"]];
function render() {
  const venc = vencidos().length;
  document.getElementById("bar").innerHTML = `
    <span class="tag"><i class="dot"></i><b>Demo</b> <span class="hide-sm">Mano Firme · datos ficticios</span></span>
    <span class="spacer"></span>
    <a class="dbtn hide-sm" href="${CASO_URL}" target="_blank" rel="noopener">Ver el proyecto</a>
    <button class="dbtn" data-act="reset">Reiniciar demo</button>`;
  const navBtn = (v, l, cls) => `<button class="${cls}" data-act="ir" data-v="${v}" ${vista === v ? 'aria-current="page"' : ""}>${I[v]}<span>${l}</span>${v === "contratos" && venc ? `<span class="count">${venc}</span>` : ""}</button>`;
  $app.innerHTML = `
    <div class="shell">
      <aside class="side">
        <div class="logo"><i>${I.logo}</i><div><b>Mano Firme</b><small>Alquiler de herramientas</small></div></div>
        ${NAV.map(([v, l]) => navBtn(v, l, "nav")).join("")}
        <div class="foot">Mostrador · ${new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</div>
      </aside>
      <main>${({ panel: vPanel, equipos: vEquipos, nuevo: vNuevo, contratos: vContratos, clientes: vClientes }[vista] || vPanel)()}</main>
    </div>
    <nav class="mtabs">${NAV.map(([v, l]) => navBtn(v, l === "Nuevo contrato" ? "Nuevo" : l, "")).join("")}</nav>`;
}

function vPanel() {
  const disp = S.equipos.filter((e) => e.estado === "disponible").length;
  const alq = S.equipos.filter((e) => e.estado === "alquilado").length;
  const venc = vencidos();
  const meses = [...S.historico, ingresoMes()];
  const max = Math.max(...meses);
  const nombres = Array.from({ length: 6 }, (_, k) => { const d = hoy(); d.setDate(1); d.setMonth(d.getMonth() - 5 + k); return d.toLocaleDateString("es-AR", { month: "short" }).replace(".", ""); });
  const proximos = S.contratos.filter((c) => c.estado === "activo").sort((a, b) => a.fin.localeCompare(b.fin));
  return `
    <div class="head"><div><h1>Panel del día</h1><p>Qué hay en el depósito, qué está afuera y qué tiene que volver.</p></div>
      <button class="btn accent" data-act="ir" data-v="nuevo">${I.nuevo} Nuevo contrato</button></div>
    <div class="grid g4">
      <div class="card kpi"><span>Disponibles</span><b>${disp}</b><small>de ${S.equipos.length} equipos</small></div>
      <div class="card kpi"><span>Alquilados</span><b>${alq}</b><small>en ${S.contratos.filter((c) => c.estado === "activo").length} contratos</small></div>
      <div class="card kpi ${venc.length ? "alert" : ""}"><span>Vencidos</span><b>${venc.length}</b><small>${venc.length ? "generan mora por día" : "todo en fecha"}</small></div>
      <div class="card kpi"><span>Ingresos del mes</span><b>${fmt(ingresoMes())}</b><small>alquileres y moras</small></div>
    </div>
    <div class="grid g2" style="margin-top:16px">
      <div class="card"><h2>Devoluciones pendientes</h2><div class="list">
        ${proximos.map((c) => { const e = estadoContrato(c); return `<div class="row"><div class="grow"><b>${esc(cli(c.clienteId).nombre)}</b><span class="hint">${c.num} · ${c.items.map((i) => esc(eq(i).nombre)).join(", ")}</span></div><span class="badge ${e.cls}">${e.t}</span><button class="btn" data-act="verContrato" data-id="${c.id}">Ver</button></div>`; }).join("") || '<p class="hint">No hay equipos afuera.</p>'}
      </div></div>
      <div class="card"><h2>Ingresos por mes</h2>
        <div class="bars">${meses.map((m, k) => `<div class="${k === 5 ? "now" : ""}" title="${fmt(m)}"><i style="height:${Math.max(6, (m / max) * 100)}%"></i><small>${nombres[k]}</small></div>`).join("")}</div>
        <p class="hint" style="margin-top:10px">El mes actual suma los contratos nuevos y las moras cobradas.</p>
      </div>
    </div>`;
}

function tarjetaEquipo(e, modo) {
  const c = cat(e.cat);
  const est = { disponible: ["Disponible", "b-ok"], alquilado: ["Alquilado", "b-info"], reparacion: ["En reparación", "b-warn"] }[e.estado];
  const sel = modo === "pick" && borrador.items.includes(e.id);
  const off = modo === "pick" && e.estado !== "disponible";
  return `<div class="eq ${sel ? "sel" : ""} ${off ? "off" : ""}">
    <div class="tile" style="background:${c.color}"><img src="img/${e.id}.jpg" alt="" loading="lazy"></div>
    <div><span class="code">${e.id.toUpperCase()} · ${c.nombre}</span><b>${esc(e.nombre)}</b><span class="hint">${esc(e.marca)}</span></div>
    <div class="foot"><span class="price">${fmt(e.tarifa)}<span class="hint"> /día</span></span><span class="badge ${sel ? "b-ok" : est[1]}">${sel ? "✓ Elegido" : est[0]}</span></div>
    ${modo === "pick" && !off ? `<button class="pick" data-act="toggleItem" data-id="${e.id}" aria-pressed="${sel}" aria-label="${sel ? "Quitar" : "Agregar"} ${esc(e.nombre)}"></button>` : ""}
  </div>`;
}
function filtrar(lista) {
  const q = busqueda.trim().toLowerCase();
  return lista.filter((e) => (filtroCat === "todas" || e.cat === filtroCat) && (!q || (e.nombre + " " + e.marca).toLowerCase().includes(q)));
}
function toolbar() {
  return `<div class="toolbar"><input class="search" type="search" placeholder="Buscar equipo o marca" value="${esc(busqueda)}" data-bind="busqueda">
    <button class="chip" data-act="cat" data-v="todas" aria-pressed="${filtroCat === "todas"}">Todas</button>
    ${CATEGORIAS.map((c) => `<button class="chip" data-act="cat" data-v="${c.id}" aria-pressed="${filtroCat === c.id}">${c.nombre}</button>`).join("")}</div>`;
}
function vEquipos() {
  return `<div class="head"><div><h1>Equipos</h1><p>El estado de cada herramienta, actualizado con cada contrato y devolución.</p></div></div>
    ${toolbar()}<div class="equipos">${filtrar(S.equipos).map((e) => tarjetaEquipo(e)).join("") || '<p class="hint">Sin resultados.</p>'}</div>`;
}

function vNuevo() {
  const c = cli(borrador.clienteId);
  const nivel = NIVELES[c.nivel];
  const enUso = activosDe(c.id);
  const cupo = nivel.maxEquipos - enUso;
  const items = borrador.items.map(eq);
  const tarifaDia = items.reduce((a, e) => a + e.tarifa, 0);
  const subtotal = tarifaDia * borrador.dias;
  const garantia = Math.round(items.reduce((a, e) => a + e.valor, 0) * nivel.garantia / 100) * 100;
  const lleno = borrador.items.length >= cupo;
  return `<div class="head"><div><h1>Nuevo contrato</h1><p>Elegí el cliente, sumá los equipos y el sistema calcula el total y la garantía.</p></div></div>
    <div class="grid g2">
      <div>${toolbar()}<div class="equipos">${filtrar(S.equipos).map((e) => tarjetaEquipo(e, "pick")).join("")}</div></div>
      <div><div class="card sticky">
        <div class="field"><label for="f-cli">Cliente</label><select id="f-cli" data-bind="clienteId">${S.clientes.map((x) => `<option value="${x.id}" ${x.id === c.id ? "selected" : ""}>${esc(x.nombre)} · ${NIVELES[x.nivel].nombre}</option>`).join("")}</select></div>
        <div class="limit ${lleno ? "full" : ""}"><span class="badge b-${c.nivel}">${nivel.nombre}</span>
          <span>${lleno ? `Llegó al máximo: hasta ${nivel.maxEquipos} equipos a la vez${enUso ? ` (ya tiene ${enUso} afuera)` : ""}.` : `Puede llevar ${cupo - borrador.items.length} equipo${cupo - borrador.items.length === 1 ? "" : "s"} más · garantía del ${nivel.garantia * 100} %.`}</span></div>
        <div class="two"><div class="field"><label for="f-ini">Desde</label><input id="f-ini" type="date" value="${borrador.inicio}" data-bind="inicio"></div>
          <div class="field"><label for="f-dias">Días</label><input id="f-dias" type="number" min="1" max="60" value="${borrador.dias}" data-bind="dias"></div></div>
        <div class="field"><label for="f-met">Medio de pago</label><select id="f-met" data-bind="metodo">${METODOS.map((m) => `<option ${m === borrador.metodo ? "selected" : ""}>${m}</option>`).join("")}</select></div>
        <div class="sum">
          ${items.map((e) => `<div class="line"><span>${esc(e.nombre)}</span><span class="num">${fmt(e.tarifa * borrador.dias)}</span></div>`).join("") || '<p class="hint">Tocá un equipo disponible para sumarlo.</p>'}
          <div class="line"><span class="hint">Devuelve el ${fmtFecha(sumarDias(borrador.inicio, borrador.dias))}</span><span class="hint">${fmt(tarifaDia)} por día</span></div>
          <div class="line"><span>Garantía (se devuelve)</span><span class="num">${fmt(garantia)}</span></div>
          <div class="line total"><span>Total alquiler</span><span class="num">${fmt(subtotal)}</span></div>
        </div>
        <button class="btn primary block" style="margin-top:14px" data-act="confirmar" ${items.length ? "" : "disabled"}>Confirmar contrato</button>
      </div></div>
    </div>`;
}

function vContratos() {
  const lista = S.contratos.filter((c) => (filtroContratos === "activos" ? c.estado === "activo" : filtroContratos === "vencidos" ? estadoContrato(c).vencido : true)).sort((a, b) => b.num.localeCompare(a.num));
  const f = (v, l) => `<button class="chip" data-act="fc" data-v="${v}" aria-pressed="${filtroContratos === v}">${l}</button>`;
  return `<div class="head"><div><h1>Contratos</h1><p>Tocá un contrato para ver el detalle o registrar la devolución.</p></div></div>
    <div class="toolbar">${f("activos", "Activos")}${f("vencidos", `Vencidos (${vencidos().length})`)}${f("todos", "Todos")}</div>
    <div class="card tablewrap"><table><thead><tr><th>N°</th><th>Cliente</th><th class="hide-m">Equipos</th><th class="hide-m">Período</th><th>Estado</th><th class="num">Total</th></tr></thead><tbody>
      ${lista.map((c) => { const e = estadoContrato(c); return `<tr class="click" data-act="verContrato" data-id="${c.id}"><td><b>${c.num}</b></td><td>${esc(cli(c.clienteId).nombre)}</td><td class="hide-m">${c.items.length}</td><td class="hide-m">${fmtFecha(c.inicio)} → ${fmtFecha(c.fin)}</td><td><span class="badge ${e.cls}">${e.t}</span></td><td class="num">${fmt(c.subtotal + (c.devolucion ? c.devolucion.mora : 0))}</td></tr>`; }).join("") || '<tr><td colspan="6" class="hint">No hay contratos en esta lista.</td></tr>'}
    </tbody></table></div>`;
}

function vClientes() {
  return `<div class="head"><div><h1>Clientes</h1><p>El nivel define cuántos equipos puede llevar a la vez y qué garantía deja.</p></div></div>
    <div class="grid g4" style="margin-bottom:16px">${Object.entries(NIVELES).map(([k, n]) => `<div class="card kpi"><span class="badge b-${k}">${n.nombre}</span><b style="font-size:22px">${n.maxEquipos} equipos</b><small>garantía del ${n.garantia * 100} % del valor</small></div>`).join("")}</div>
    <div class="card tablewrap"><table><thead><tr><th>Cliente</th><th class="hide-m">DNI / CUIT</th><th>Nivel</th><th class="num">Equipos afuera</th><th class="num hide-m">Contratos</th></tr></thead><tbody>
      ${S.clientes.map((c) => `<tr><td><b>${esc(c.nombre)}</b><span class="hint">${esc(c.tel)}</span></td><td class="hide-m">${esc(c.doc)}</td><td><span class="badge b-${c.nivel}">${NIVELES[c.nivel].nombre}</span></td><td class="num">${activosDe(c.id)} / ${NIVELES[c.nivel].maxEquipos}</td><td class="num hide-m">${S.contratos.filter((k) => k.clienteId === c.id).length}</td></tr>`).join("")}
    </tbody></table></div>`;
}

// ---------- Contrato y devolución ----------
let dev = null;
function abrirContrato(id) {
  const c = S.contratos.find((k) => k.id === id);
  const e = estadoContrato(c);
  const atraso = c.estado === "activo" ? Math.max(0, diasEntre(c.fin, iso(hoy()))) : 0;
  if (c.estado === "activo" && (!dev || dev.id !== id)) dev = { id, items: Object.fromEntries(c.items.map((i) => [i, { vuelve: true, danio: false, monto: "" }])) };
  const mora = atraso * c.tarifaDia;
  const danios = c.estado === "activo" ? Object.entries(dev.items).filter(([, v]) => v.vuelve && v.danio).reduce((a, [, v]) => a + (Number(v.monto) || 0), 0) : 0;
  const ninguno = c.estado === "activo" && !Object.values(dev.items).some((v) => v.vuelve);
  $modal.innerHTML = `<div class="overlay" data-act="cerrarModal"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-t" data-stop>
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><div><span class="hint">${c.num} · ${c.metodo}</span><h2 id="dlg-t">${esc(cli(c.clienteId).nombre)}</h2></div><span class="badge ${e.cls}">${e.t}</span></div>
    <p class="hint" style="margin-top:6px">${fmtFecha(c.inicio)} → ${fmtFecha(c.fin)} · ${c.dias} días · ${fmt(c.tarifaDia)} por día · garantía ${fmt(c.garantia)}</p>
    ${c.estado === "activo" ? `
      <h3 style="margin-top:18px;font-size:15px">Registrar devolución</h3>
      ${c.items.map((i) => { const x = dev.items[i]; return `<div class="dev"><label class="top"><input type="checkbox" data-dev="vuelve" data-id="${i}" ${x.vuelve ? "checked" : ""}> <b class="grow">${esc(eq(i).nombre)}</b><span class="hint">${i.toUpperCase()}</span></label>
        ${x.vuelve ? `<div class="dmg"><label><input type="checkbox" data-dev="danio" data-id="${i}" ${x.danio ? "checked" : ""}> Vuelve con daño</label>${x.danio ? `<input type="number" min="0" step="1000" placeholder="Costo de reparación" value="${x.monto}" data-dev="monto" data-id="${i}">` : ""}</div>` : ""}</div>`; }).join("")}
      <div class="sum" style="margin-top:14px">
        <div class="line"><span>Mora ${atraso ? `(${atraso} ${atraso === 1 ? "día" : "días"} de atraso)` : ""}</span><span class="num">${fmt(mora)}</span></div>
        <div class="line"><span>Daños</span><span class="num">${fmt(danios)}</span></div>
        <div class="line total"><span>Garantía a devolver</span><span class="num">${fmt(Math.max(0, c.garantia - danios))}</span></div>
      </div>
      <div class="actions"><button class="btn" data-act="cerrarModal">Cancelar</button><button class="btn primary" data-act="devolver" data-id="${c.id}" ${ninguno ? "disabled" : ""}>Confirmar devolución</button></div>
    ` : `
      <div class="list" style="margin-top:12px">${c.items.map((i) => { const d = c.devolucion.danios.find((x) => x.eqId === i); return `<div class="row"><div class="grow"><b>${esc(eq(i).nombre)}</b>${d ? `<span class="hint">${esc(d.desc)}</span>` : ""}</div>${d ? `<span class="badge b-danger">Daño ${fmt(d.monto)}</span>` : '<span class="badge b-ok">Sin daños</span>'}</div>`; }).join("")}</div>
      <div class="sum" style="margin-top:12px"><div class="line"><span>Devuelto</span><span>${fmtFecha(c.devolucion.fecha)}</span></div><div class="line"><span>Mora cobrada</span><span class="num">${fmt(c.devolucion.mora)}</span></div><div class="line total"><span>Garantía devuelta</span><span class="num">${fmt(c.devolucion.garantiaDevuelta)}</span></div></div>
      <div class="actions"><button class="btn" data-act="cerrarModal">Cerrar</button></div>`}
  </div></div>`;
}

// ---------- Acciones ----------
function toast(t) { $toast.textContent = t; $toast.classList.add("on"); clearTimeout(toast.h); toast.h = setTimeout(() => $toast.classList.remove("on"), 2600); }
function ir(v) { vista = v; history.replaceState(null, "", "#" + v); render(); window.scrollTo(0, 0); }

document.addEventListener("click", (ev) => {
  const el = ev.target.closest("[data-act]");
  if (!el) return;
  if (el.dataset.act === "cerrarModal" && ev.target.closest("[data-stop]") && el.classList.contains("overlay")) return;
  const { act, v, id } = el.dataset;
  if (act === "ir") ir(v);
  else if (act === "cat") { filtroCat = v; render(); }
  else if (act === "fc") { filtroContratos = v; render(); }
  else if (act === "reset") { localStorage.removeItem(KEY); S = semilla(); dev = null; borrador.items = []; $modal.innerHTML = ""; render(); toast("Demo reiniciada"); }
  else if (act === "toggleItem") {
    const i = borrador.items.indexOf(id);
    if (i >= 0) borrador.items.splice(i, 1);
    else {
      const c = cli(borrador.clienteId), cupo = NIVELES[c.nivel].maxEquipos - activosDe(c.id);
      if (borrador.items.length >= cupo) { toast(`Nivel ${NIVELES[c.nivel].nombre}: máximo ${NIVELES[c.nivel].maxEquipos} equipos a la vez`); return; }
      borrador.items.push(id);
    }
    render();
  } else if (act === "confirmar") {
    const c = cli(borrador.clienteId), nivel = NIVELES[c.nivel];
    const items = borrador.items.map(eq);
    const k = { id: "k" + S.seq, num: "C-0" + S.seq++, clienteId: c.id, items: [...borrador.items], inicio: borrador.inicio, fin: sumarDias(borrador.inicio, borrador.dias), dias: borrador.dias, tarifaDia: items.reduce((a, e) => a + e.tarifa, 0), metodo: borrador.metodo, estado: "activo" };
    k.subtotal = k.tarifaDia * k.dias;
    k.garantia = Math.round(items.reduce((a, e) => a + e.valor, 0) * nivel.garantia / 100) * 100;
    items.forEach((e) => (e.estado = "alquilado"));
    S.contratos.push(k); borrador.items = []; guardar();
    filtroContratos = "activos"; ir("contratos"); toast(`Contrato ${k.num} creado`);
  } else if (act === "verContrato") { dev = null; abrirContrato(id); }
  else if (act === "cerrarModal") { if (ev.target === el || el.tagName === "BUTTON") { $modal.innerHTML = ""; dev = null; } }
  else if (act === "devolver") {
    const c = S.contratos.find((x) => x.id === id);
    const atraso = Math.max(0, diasEntre(c.fin, iso(hoy())));
    const vuelven = Object.entries(dev.items).filter(([, x]) => x.vuelve);
    const danios = vuelven.filter(([, x]) => x.danio).map(([eqId, x]) => ({ eqId, monto: Number(x.monto) || 0, desc: "Daño registrado en la devolución" }));
    const total = danios.reduce((a, d) => a + d.monto, 0);
    vuelven.forEach(([eqId, x]) => (eq(eqId).estado = x.danio ? "reparacion" : "disponible"));
    const quedan = c.items.filter((i) => !dev.items[i].vuelve);
    if (quedan.length) {
      // Devolución parcial: el contrato sigue abierto con lo que falta.
      c.items = quedan; c.tarifaDia = quedan.reduce((a, i) => a + eq(i).tarifa, 0);
      toast(`Devolución parcial registrada · quedan ${quedan.length} equipo${quedan.length === 1 ? "" : "s"} afuera`);
    } else {
      c.estado = "cerrado";
      c.devolucion = { fecha: iso(hoy()), mora: atraso * c.tarifaDia, danios, garantiaDevuelta: Math.max(0, c.garantia - total) };
      toast(`Contrato ${c.num} cerrado`);
    }
    guardar(); $modal.innerHTML = ""; dev = null; render();
  }
});
document.addEventListener("input", (ev) => {
  const b = ev.target.dataset.bind;
  if (b === "busqueda") { busqueda = ev.target.value; const pos = ev.target.selectionStart; render(); const n = document.querySelector('[data-bind="busqueda"]'); n.focus(); n.setSelectionRange(pos, pos); }
});
document.addEventListener("change", (ev) => {
  const t = ev.target, b = t.dataset.bind;
  if (b === "clienteId") { borrador.clienteId = t.value; borrador.items = []; render(); }
  else if (b === "inicio") { borrador.inicio = t.value || iso(hoy()); render(); }
  else if (b === "dias") { borrador.dias = Math.min(60, Math.max(1, Number(t.value) || 1)); render(); }
  else if (b === "metodo") { borrador.metodo = t.value; }
  else if (t.dataset.dev) {
    const x = dev.items[t.dataset.id];
    if (t.dataset.dev === "monto") x.monto = t.value; else x[t.dataset.dev] = t.checked;
    abrirContrato(dev.id);
  }
});
document.addEventListener("keydown", (ev) => { if (ev.key === "Escape" && $modal.innerHTML) { $modal.innerHTML = ""; dev = null; } });
window.addEventListener("hashchange", () => { vista = location.hash.slice(1) || "panel"; render(); });
render();
