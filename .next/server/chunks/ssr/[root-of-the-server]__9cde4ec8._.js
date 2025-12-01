module.exports = {

"[project]/.next-internal/server/app/home/page/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[project]/src/app/icon.svg.mjs { IMAGE => \"[project]/src/app/icon.svg (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/icon.svg.mjs { IMAGE => \"[project]/src/app/icon.svg (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/supabase/server.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "createServerSupabase": ()=>createServerSupabase
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
;
;
async function createServerSupabase() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://khgmjbsfblabpcktajea.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZ21qYnNmYmxhYnBja3RhamVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTA4NTIsImV4cCI6MjA3OTUyNjg1Mn0.PSg5KUqP2gVL6OtS-WbaQQmHoRN-EiqRUAaFvNDsO-A"), {
        cookies: {
            get (name) {
                return cookieStore.get(name)?.value;
            },
            set (name, value, options) {
                try {
                    cookieStore.set(name, value, options);
                } catch  {
                // ignore erro em GET
                }
            },
            remove (name, options) {
                try {
                    cookieStore.delete({
                        name,
                        ...options
                    });
                } catch  {
                // ignore erro em GET
                }
            }
        }
    });
}
}),
"[project]/src/services/home/loadHomeServer.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/services/home/loadHomeServer.ts
__turbopack_context__.s({
    "default": ()=>loadHomeServer
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
;
async function loadHomeServer(userId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
    // ------------------------------------
    // 1) Buscar metas do usuário (tabela users)
    // ------------------------------------
    const { data: user, error: userErr } = await supabase.from("users").select("meta_agua, meta_calorias, meta_refeicoes").eq("id", userId).single();
    const metas = {
        metaAgua: user?.meta_agua ?? 2000,
        metaCalorias: user?.meta_calorias ?? 2000,
        metaRefeicoes: user?.meta_refeicoes ?? 4
    };
    // ------------------------------------
    // 2) Buscar refeições de hoje
    // ------------------------------------
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const { data: mealsToday, error: mealsErr } = await supabase.from("meals").select("*").eq("user_id", userId).gte("created_at", start.toISOString()).order("created_at", {
        ascending: false
    });
    const meals = mealsToday ?? [];
    const caloriesValue = meals.reduce((sum, m)=>sum + (m.calories ?? 0), 0);
    // ------------------------------------
    // 3) Buscar quantidade de água ingerida hoje
    // (caso não tenha uma tabela water_records ainda, usamos 0)
    // ------------------------------------
    let waterValue = 0;
    const { data: waterRows } = await supabase.from("water_records").select("amount, created_at").eq("user_id", userId).gte("created_at", start.toISOString());
    if (waterRows && waterRows.length > 0) {
        waterValue = waterRows.reduce((s, w)=>s + (w.amount ?? 0), 0);
    }
    // ------------------------------------
    // 4) Buscar plano semanal gerado pela IA
    // ------------------------------------
    const { data: planRow } = await supabase.from("ai_generated_plans").select("content").eq("user_id", userId).eq("plan_type", "weekly_meal_plan").order("created_at", {
        ascending: false
    }).limit(1).single();
    const rawWeek = planRow?.content?.week ?? {};
    const shoppingList = planRow?.content?.shopping_list ?? [];
    const normalizeMeal = (item)=>{
        if (typeof item === "string") {
            return {
                title: item,
                description: "",
                calories: 0
            };
        }
        return {
            title: String(item?.title ?? ""),
            description: String(item?.description ?? ""),
            calories: Number(item?.calories ?? 0)
        };
    };
    const plan = {
        domingo: (rawWeek.domingo ?? []).map(normalizeMeal),
        segunda: (rawWeek.segunda ?? []).map(normalizeMeal),
        terca: (rawWeek.terca ?? []).map(normalizeMeal),
        quarta: (rawWeek.quarta ?? []).map(normalizeMeal),
        quinta: (rawWeek.quinta ?? []).map(normalizeMeal),
        sexta: (rawWeek.sexta ?? []).map(normalizeMeal),
        sabado: (rawWeek.sabado ?? []).map(normalizeMeal)
    };
    // ------------------------------------
    // 5) Totais de calorias do plano (por dia)
    // ------------------------------------
    const totals = {
        domingo: 0,
        segunda: 0,
        terca: 0,
        quarta: 0,
        quinta: 0,
        sexta: 0,
        sabado: 0
    };
    Object.keys(plan).forEach((day)=>{
        totals[day] = plan[day].reduce((s, m)=>s + (m.calories ?? 0), 0);
    });
    // ------------------------------------
    // 6) Cálculo dos percentuais
    // ------------------------------------
    const waterPercent = Math.min(100, waterValue / metas.metaAgua * 100);
    const mealsPercent = Math.min(100, meals.length / metas.metaRefeicoes * 100);
    const caloriesPercent = Math.min(100, caloriesValue / metas.metaCalorias * 100);
    return {
        metas,
        meals,
        plan,
        shoppingList,
        totals,
        progress: {
            water: waterPercent,
            meals: mealsPercent,
            calories: caloriesPercent,
            waterValue,
            caloriesValue,
            mealsDone: meals.length,
            metaAgua: metas.metaAgua,
            metaRefeicoes: metas.metaRefeicoes,
            metaCalorias: metas.metaCalorias
        }
    };
}
}),
"[project]/src/app/home/HomeClient.tsx [app-rsc] (client reference proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/home/HomeClient.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/home/HomeClient.tsx <module evaluation>", "default");
}),
"[project]/src/app/home/HomeClient.tsx [app-rsc] (client reference proxy)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/home/HomeClient.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/home/HomeClient.tsx", "default");
}),
"[project]/src/app/home/HomeClient.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$home$2f$HomeClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/home/HomeClient.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$home$2f$HomeClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/home/HomeClient.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$home$2f$HomeClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/lib/supabase/getUserServer.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "getUserServer": ()=>getUserServer
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
;
async function getUserServer() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
    const { data } = await supabase.auth.getUser();
    return {
        supabase,
        user: data.user
    };
}
}),
"[project]/src/app/home/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/app/home/page.tsx
__turbopack_context__.s({
    "default": ()=>HomePage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$home$2f$loadHomeServer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/home/loadHomeServer.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$home$2f$HomeClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/home/HomeClient.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$getUserServer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/getUserServer.ts [app-rsc] (ecmascript)");
;
;
;
;
;
async function HomePage() {
    const { user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$getUserServer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserServer"])();
    if (!user) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$home$2f$loadHomeServer$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(user.id);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$home$2f$HomeClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        user: user,
        data: data
    }, void 0, false, {
        fileName: "[project]/src/app/home/page.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/app/home/page.tsx [app-rsc] (ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/home/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__9cde4ec8._.js.map