(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/services/goals/calculateUserTargets.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/services/goals/calculateUserTargets.ts
__turbopack_context__.s({
    "calculateUserTargets": ()=>calculateUserTargets
});
/** Fator de atividade baseado no nível do usuário */ function activityFactor(nivel, freq) {
    if (nivel === "Iniciante") return 1.4;
    if (nivel === "Intermediário") return 1.55;
    if (nivel === "Avançado") return 1.7;
    // fallback básico
    return 1.5;
}
/** Classificação de dieta baseada em alergias e padrão alimentar */ function detectDietType(payload) {
    const allergies = payload.alergias.map((a)=>a.toLowerCase());
    if (allergies.includes("lactose")) return "dairy_free";
    if (allergies.includes("glúten")) return "gluten_free";
    if (allergies.includes("nenhuma alergia/intolerância")) return "balanced";
    // alimentação muito ruim ou muito boa pode afetar estilo
    if (payload.alimentacao_atual === "Muito mal" || payload.alimentacao_atual === "Mal") {
        return "balanced_simple"; // dieta mais simples e fácil de seguir
    }
    return "balanced";
}
function calculateUserTargets(payload) {
    const peso = payload.peso_atual;
    const altura = payload.altura;
    const idade = 25; // opcional melhorar depois
    const genero = payload.genero.toLowerCase();
    // Fórmula Mifflin-St Jeor (mais usada atualmente)
    let TMB = genero === "masculino" ? 10 * peso + 6.25 * altura - 5 * idade + 5 : 10 * peso + 6.25 * altura - 5 * idade - 161;
    const AF = activityFactor(payload.nivel_treino, payload.frequencia_treino);
    const TDEE = TMB * AF;
    // ajuste metas conforme objetivo
    let dailyCalories = TDEE;
    if (payload.objetivo === "Perder peso") {
        dailyCalories = TDEE - 350;
    } else if (payload.objetivo === "Ganhar massa muscular") {
        dailyCalories = TDEE + 300;
    }
    // proteína (meta simples)
    const dailyProtein = Math.round(peso * 1.8);
    // água (meta simples)
    const dailyWater = peso * 35; // ml
    const meals = Number(payload.refeicoes_dia.replace(/\D/g, "")) || 4;
    const dietType = detectDietType(payload);
    return {
        daily_calorie_goal: Math.round(dailyCalories),
        daily_protein_goal: dailyProtein,
        daily_water_goal: Math.round(dailyWater),
        daily_meals_goal: meals,
        diet_type: dietType
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/services/goals/saveUserTargets.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/services/goals/saveUserTargets.ts
__turbopack_context__.s({
    "saveUserTargets": ()=>saveUserTargets
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
;
async function saveUserTargets(userId, targets) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("users").update({
        daily_calorie_goal: targets.daily_calorie_goal,
        daily_protein_goal: targets.daily_protein_goal,
        daily_water_goal: targets.daily_water_goal,
        daily_meals_goal: targets.daily_meals_goal,
        diet_type: targets.diet_type
    }).eq("id", userId);
    if (error) {
        console.error("Erro ao salvar metas:", error);
        throw new Error(error.message);
    }
    return true;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/services/quiz/quizService.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// /services/quizService.ts
__turbopack_context__.s({
    "calculateWeightProjection": ()=>calculateWeightProjection,
    "default": ()=>__TURBOPACK__default__export__,
    "generateMotivationalBenefits": ()=>generateMotivationalBenefits,
    "saveQuizResponses": ()=>saveQuizResponses,
    "updateUserFromQuiz": ()=>updateUserFromQuiz
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
"use client";
;
async function saveQuizResponses(userId, payload) {
    try {
        const toInsert = {
            user_id: userId,
            objetivo: payload.objetivo,
            nivel_treino: payload.nivel_treino,
            frequencia_treino: payload.frequencia_treino,
            horario_treino: payload.horario_treino,
            alimentacao_atual: payload.alimentacao_atual,
            refeicoes_dia: payload.refeicoes_dia,
            rotina_trabalho: payload.rotina_trabalho,
            nivel_disciplina: payload.nivel_disciplina,
            dificuldade_principal: payload.dificuldade_principal,
            horario_dificil: payload.horario_dificil,
            agua: payload.agua,
            sono: payload.sono,
            tentou_dieta: payload.tentou_dieta,
            expectativa: payload.expectativa,
            prazo_resultado: payload.prazo_resultado,
            peso_atual: payload.peso_atual,
            altura: payload.altura,
            peso_desejado: payload.peso_desejado,
            alergias: payload.alergias,
            created_at: new Date().toISOString()
        };
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("quiz_responses").insert([
            toInsert
        ]).select().single();
        if (error) {
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true,
            data
        };
    } catch (err) {
        return {
            success: false,
            error: err.message || "Erro desconhecido"
        };
    }
}
async function updateUserFromQuiz(userId, payload) {
    try {
        const updateObj = {};
        if (typeof payload.peso_atual === "number") updateObj.peso_atual = payload.peso_atual;
        if (typeof payload.peso_desejado === "number") updateObj.peso_desejado = payload.peso_desejado;
        if (typeof payload.peso_atual === "number") updateObj.peso_inicial = payload.peso_atual; // definir peso_inicial no primeiro quiz
        if (typeof payload.altura === "number") updateObj.altura = payload.altura;
        if (payload.objetivo) updateObj.objetivo = payload.objetivo;
        if (payload.nivel_treino) updateObj.nivel_treino = payload.nivel_treino;
        if (payload.frequencia_treino) updateObj.frequencia_semanal = payload.frequencia_treino;
        // Se não houver nada a atualizar:
        if (Object.keys(updateObj).length === 0) {
            return {
                success: false,
                error: "Nenhum campo para atualizar"
            };
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("users").update(updateObj).eq("id", userId).select().single();
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            data
        };
    } catch (err) {
        return {
            success: false,
            error: err.message || "Erro desconhecido"
        };
    }
}
function calculateWeightProjection(pesoAtual, pesoDesejado) {
    let weeks = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 12;
    // Evita divisão por zero
    const w = Math.max(1, Math.floor(weeks));
    const diff = pesoDesejado - pesoAtual;
    const step = diff / w;
    const arr = [];
    for(let i = 0; i <= w; i++){
        const weight = +(pesoAtual + step * i).toFixed(1); // 1 casa decimal
        arr.push({
            week: i,
            weight
        });
    }
    return arr;
}
function generateMotivationalBenefits(payload) {
    var _payload_dificuldade_principal;
    const benefits = [];
    // objetivo
    if (/emagrec|perder/i.test(payload.objetivo)) {
        benefits.push("Plano focado em queima de gordura com metas semanais realistas.");
    } else if (/massa|ganhar/i.test(payload.objetivo)) {
        benefits.push("Plano orientado para ganho de massa com equilíbrio calórico e proteína.");
    } else {
        benefits.push("Plano personalizado para manutenção e hábitos consistentes.");
    }
    // nível de treino
    if (/iniciante|beginner/i.test(payload.nivel_treino)) {
        benefits.push("Treinos iniciais fáceis de seguir — ideal para começar sem lesões.");
    } else if (/intermedi|médio/i.test(payload.nivel_treino)) {
        benefits.push("Treinos moderados para acelerar progresso com segurança.");
    } else {
        benefits.push("Treinos avançados para quem busca evolução consistente.");
    }
    // água / sono
    if (Number(payload.agua) < 6 || /pouco/i.test(payload.agua)) {
        benefits.push("Dicas práticas para aumentar sua hidratação diária.");
    }
    if (Number(payload.sono) < 7 || /pouco/i.test(payload.sono)) {
        benefits.push("Estratégias para melhorar a qualidade do sono e recuperação.");
    }
    // dificuldades / disciplina
    if ((_payload_dificuldade_principal = payload.dificuldade_principal) === null || _payload_dificuldade_principal === void 0 ? void 0 : _payload_dificuldade_principal.length) {
        benefits.push("Soluções rápidas para ".concat(payload.dificuldade_principal.slice(0, 2).join(", "), "."));
    }
    // expectativa / prazo
    if (/rápido|30 dias|um mês|1 mês/i.test(payload.prazo_resultado)) {
        benefits.push("Metas realistas: pequenas vitórias semanais são mais sustentáveis.");
    }
    // fallback
    if (benefits.length === 0) {
        benefits.push("Plano personalizado e progressivo para te ajudar diariamente.");
    }
    return benefits;
}
const __TURBOPACK__default__export__ = {
    saveQuizResponses,
    updateUserFromQuiz,
    calculateWeightProjection,
    generateMotivationalBenefits
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/services/quiz/finishQuizAfterSignup.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "finishQuizAfterSignup": ()=>finishQuizAfterSignup
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$goals$2f$calculateUserTargets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/goals/calculateUserTargets.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$goals$2f$saveUserTargets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/goals/saveUserTargets.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$quiz$2f$quizService$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/quiz/quizService.tsx [app-client] (ecmascript)");
;
;
;
;
async function finishQuizAfterSignup(userId) {
    const raw = localStorage.getItem("quizData");
    if (!raw) return;
    const quizData = JSON.parse(raw);
    const payload = {
        ...quizData,
        peso_atual: Number(quizData.peso_atual),
        peso_desejado: Number(quizData.peso_desejado),
        altura: Number(quizData.altura)
    };
    // 1) Salvar quiz responses
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$quiz$2f$quizService$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].saveQuizResponses(userId, payload);
    // 2) Atualizar tabela users
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("users").update({
        peso_atual: payload.peso_atual,
        peso_inicial: payload.peso_atual,
        peso_desejado: payload.peso_desejado,
        altura: payload.altura,
        objetivo: payload.objetivo,
        nivel_treino: payload.nivel_treino,
        frequencia_semanal: payload.frequencia_treino
    }).eq("id", userId);
    // 3) Calcular e salvar metas
    const targets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$goals$2f$calculateUserTargets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateUserTargets"])(payload);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$goals$2f$saveUserTargets$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveUserTargets"])(userId, targets);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/signup/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>SignupPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/AInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/AButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$quiz$2f$finishQuizAfterSignup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/quiz/finishQuizAfterSignup.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function SignupPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [nome, setNome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [senha, setSenha] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSignup = async ()=>{
        try {
            var _data_user;
            setLoading(true);
            // 1) Criar usuário no Supabase Auth
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signUp({
                email,
                password: senha
            });
            if (error) throw error;
            const userId = (_data_user = data.user) === null || _data_user === void 0 ? void 0 : _data_user.id;
            if (!userId) throw new Error("Erro ao localizar usuário.");
            var _get;
            // 2) Pegar plano selecionado
            const plano = (_get = new URLSearchParams(window.location.search).get("plano")) !== null && _get !== void 0 ? _get : "free";
            // 3) Criar user no banco usando service role
            const res = await fetch("/api/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId,
                    name: nome,
                    email,
                    plan: plano
                })
            });
            if (!res.ok) {
                const err = await res.json().catch(()=>({}));
                throw new Error(err.error || "Erro ao salvar usuário no banco.");
            }
            // 4) Salvar quiz
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$quiz$2f$finishQuizAfterSignup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["finishQuizAfterSignup"])(userId);
            const planResp = await fetch("/api/ai/generate-plan", {
                method: "POST"
            });
            if (!planResp.ok) {
                console.error("Falha ao gerar plano", await planResp.text());
            }
            // 5) Limpar
            localStorage.removeItem("quizData");
            localStorage.removeItem("quiz_completed");
            // 6) Redirecionar
            router.push("/home");
        } catch (err) {
            console.error(err);
            alert(err.message || "Erro ao criar conta.");
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen w-full flex items-center justify-center p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-sm flex flex-col gap-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-[#0A0A0A]",
                    children: "Criar conta"
                }, void 0, false, {
                    fileName: "[project]/src/app/signup/page.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Nome",
                            value: nome,
                            onChange: (e)=>setNome(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Email",
                            type: "email",
                            value: email,
                            onChange: (e)=>setEmail(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Senha",
                            type: "password",
                            value: senha,
                            onChange: (e)=>setSenha(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            type: "button",
                            onClick: handleSignup,
                            children: loading ? "Criando conta..." : "Criar conta"
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/signup/page.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/signup/page.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/signup/page.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_s(SignupPage, "om4TkEKxGL/52WRMIUfvzd55kXg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SignupPage;
var _c;
__turbopack_context__.k.register(_c, "SignupPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=_cedd043c._.js.map