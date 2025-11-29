(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/services/quizService.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
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
"[project]/src/app/signup/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>Signup
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/AInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/AButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$quizService$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/quizService.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function Signup() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { signUp: signUpCtx } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])(); // NÃO usar para criar conta
    const [nome, setNome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [senha, setSenha] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSignup = async ()=>{
        try {
            var _data_user;
            setLoading(true);
            // 1) CRIAR USUÁRIO NO AUTH
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signUp({
                email,
                password: senha,
                options: {
                    emailRedirectTo: "".concat(location.origin, "/home")
                }
            });
            if (error) throw error;
            // ID retornado pelo Supabase
            let userId = (_data_user = data.user) === null || _data_user === void 0 ? void 0 : _data_user.id;
            if (!userId) {
                var _session_data_session_user, _session_data_session;
                const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                var _session_data_session_user_id;
                userId = (_session_data_session_user_id = (_session_data_session = session.data.session) === null || _session_data_session === void 0 ? void 0 : (_session_data_session_user = _session_data_session.user) === null || _session_data_session_user === void 0 ? void 0 : _session_data_session_user.id) !== null && _session_data_session_user_id !== void 0 ? _session_data_session_user_id : undefined;
                if (!userId) throw new Error("ID do usuário não encontrado.");
            }
            var _get;
            // 2) DEFINIR PLANO
            const planoSelecionado = (_get = new URLSearchParams(window.location.search).get("plano")) !== null && _get !== void 0 ? _get : "free";
            // 3) INSERIR USUÁRIO NA TABELA users
            const { error: insertUserError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("users").insert({
                id: userId,
                name: nome,
                email: email,
                plan: planoSelecionado,
                onboarding_done: true
            });
            if (insertUserError) throw insertUserError;
            // 4) LER QUIZ DO LOCALSTORAGE
            const quizDataRaw = localStorage.getItem("quizData");
            if (!quizDataRaw) {
                router.push("/home");
                return;
            }
            const quizData = JSON.parse(quizDataRaw);
            const payload = {
                ...quizData,
                peso_atual: Number(quizData.peso_atual),
                altura: Number(quizData.altura),
                peso_desejado: Number(quizData.peso_desejado),
                dia_nascimento: String(quizData.dia_nascimento),
                mes_nascimento: String(quizData.mes_nascimento),
                ano_nascimento: String(quizData.ano_nascimento)
            };
            // 5) SALVAR QUIZ
            const saveRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$quizService$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].saveQuizResponses(userId, payload);
            if (!saveRes.success) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("quiz_responses").insert({
                    user_id: userId,
                    ...payload,
                    created_at: new Date().toISOString()
                });
            }
            // 6) ATUALIZAR USER COM CAMPOS DO QUIZ
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("users").update({
                peso_atual: payload.peso_atual,
                peso_inicial: payload.peso_atual,
                peso_desejado: payload.peso_desejado,
                altura: payload.altura,
                objetivo: payload.objetivo,
                nivel_treino: payload.nivel_treino,
                frequencia_semanal: payload.frequencia_treino
            }).eq("id", userId);
            // 7) LIMPAR E IR PARA HOME
            localStorage.removeItem("quizData");
            localStorage.removeItem("quiz_completed");
            await new Promise((res)=>setTimeout(res, 200));
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
                    lineNumber: 124,
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
                            lineNumber: 127,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Email",
                            type: "email",
                            value: email,
                            onChange: (e)=>setEmail(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 135,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Senha",
                            type: "password",
                            value: senha,
                            onChange: (e)=>setSenha(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$AButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            type: "button",
                            onClick: handleSignup,
                            children: loading ? "Criando conta..." : "Criar conta"
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-center text-sm mt-2 text-[#6F6F6F]",
                            children: [
                                "Já tem conta?",
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    onClick: ()=>router.push("/login"),
                                    className: "text-[#00C974] font-semibold cursor-pointer",
                                    children: "Entrar"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/signup/page.tsx",
                                    lineNumber: 159,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/signup/page.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/signup/page.tsx",
            lineNumber: 123,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/signup/page.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_s(Signup, "CcD8Fqt2uowlsmeAs6SsLpocT7U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = Signup;
var _c;
__turbopack_context__.k.register(_c, "Signup");
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

//# sourceMappingURL=_e4cb3c13._.js.map