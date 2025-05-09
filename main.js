var urlParams = getURLParams();

function getURLParams() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    const paramsObject = {};
    for (const [key, value] of params.entries()) {
        paramsObject[key] = value;
    }

    paramsObject["activeScreen"] = url.pathname.split("/")[url.pathname.split("/").length - 1];
    return paramsObject;
}

function setupShortcuts() {
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.altKey) {
            if (event.key === 's') {
                openNewWindow('skycoderbrws001.w',1024,600,0,'');
            } else if (event.key === 'l') {
                event.preventDefault();
                aN('ssusrbrws001.w','PkUOmtajacaVacaA','','27358','SecuredUserSuperUser');
            } else if (event.key === 'c') {
                event.preventDefault();
                // Login as Cramer
                aN('sfmlybrws001.w?recID=0x00000000037f690b&encrecID=cnjldbduiciklHjp','dljpQdjscoalcCJg','','28659','FamilyAccessSuperUser','');
            } else if (event.key === "e") {
                openNewWindow('secfgbrws001.w',1050,700,1);
            } else if (event.key === "d") {
                openNewWindow('sdatabrws000.w',1050,700,1);
            } else if (event.key === "u") {
                aN('ssusrbrws001.w?supervisors=1','PkUOmtajacaVacaA','','27358','SecuredUserSuperUser');
            } else if (event.key === "t") {
                openNewWindow('qprntbrws003.w?whereFrom=qprntbrws002',1000,620,0,'browse');
            }
        }
    });
}

// ***** AVAILABLE TO ALL USERS **************************************************
if (urlParams.activeScreen === "sfmlybrws001.w") {
    if (urlParams.lastName) {
        let searchInput = document.getElementById("brDepartmentsLookupInput");
        searchInput.value = `${urlParams.lastName} ${urlParams.firstName}`;
        localStorage.setItem("webLogin", true);
        searchInput.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }));
    } else {
        let webLogin = localStorage.getItem("webLogin");
        if (webLogin === "true") {
            let bWLogin = document.getElementById("bWLogin");
            if (bWLogin) {
                bWLogin.click();
            }
            localStorage.removeItem("webLogin");
        }
    }
}
// *******************************************************************************

const duserid = document.getElementById("duserid");
if (duserid) {
    if (duserid.value === "vasileiadisp") {
        setupShortcuts();

        if (urlParams.activeScreen === "sstudtabs001.w") {
            const studentsPending = JSON.parse(localStorage.getItem("studentsPending"));
            const students = studentsPending && studentsPending.rows ? studentsPending.rows : studentsPending;
            if (hCurrentTab.value === "prfl") {
                const clearStudentButton = document.createElement("a");
                clearStudentButton.className = "button";
                clearStudentButton.style = "top: 180px; position: relative";
                clearStudentButton.href = "javascript:;";
                clearStudentButton.innerText = "Clear Pending";
                document.getElementById("bLog").after(clearStudentButton);
                clearStudentButton.addEventListener("click", async () => {
                    localStorage.removeItem("studentsPending");
                    refreshTabs();
                });
            }
            if (students && students.length > 0) {
                if (
                    students[0]["Library Id"] &&
                    // students[0]["House"] &&
                    students[0]["SW Profile"] === "Done" &&
                    students[0]["SW Web Access"] === "Done" &&
                    students[0]["SW Family"] === "Done"
                ) {
                    students.splice(0, 1);
                    localStorage.setItem("studentsPending", JSON.stringify(students));
                    loadTab("prfl");
                } else {
                    const tCurrentNameKey = document.getElementById("tCurrentNameKey");
                    if (tCurrentNameKey.value === students[0]["Alpha Key"]) {
                        if (
                            students[0]["SW Profile"] === "Pending" ||
                            students[0]["SW Web Access"] === "Pending" ||
                            students[0]["SW Family"] === "Pending" ||
                            students[0]["House"] === "Pending"
                        ) {
                            setTimeout(() => { refreshTabs(); }, 2000);
                        } else {
                            const hCurrentTab = document.getElementById("hCurrentTab");
                            if (students[0]["SW Profile"] === "") {
                                if (hCurrentTab.value === "prfl") {
                                    students[0]["SW Profile"] = "Pending";
                                    localStorage.setItem("studentsPending", JSON.stringify(students));
                                    openNewWindow("sstudgenedit001.w?action=initializeStudent",1024,768,1,'edit',0,2);
                                    refreshTabs();
                                } else {
                                    loadTab("prfl");
                                }
                            } else if (students[0]["SW Web Access"] === "") {
                                if (hCurrentTab.value === "weba") {
                                    students[0]["SW Web Access"] = "Pending";
                                    localStorage.setItem("studentsPending", JSON.stringify(students));
                                    openNewWindow("ssauedit001.w?action=initializeStudent", 1013, 500, 0, "edit");
                                    refreshTabs();
                                } else {
                                    loadTab("weba");
                                }
                            } else if (students[0]["SW Family"] === "") {
                                if (hCurrentTab.value === "fam") {
                                    let currentParentIndex = localStorage.getItem("currentParentIndex");
                                    if (+currentParentIndex < 0) {
                                        localStorage.removeItem("currentParentIndex");
                                        students[0]["SW Family"] = "Done"
                                        localStorage.setItem("studentsPending", JSON.stringify(students));
                                        (async () => {
                                            await jsonpCall("action=jsonpUpdateDB&table=Students&alphaKey=" + students[0]["Alpha Key"] + "&column=SW Family&value=Done");
                                            loadTab("prfl");
                                        })();
                                    } else {
                                        let parentEditLinks = document.querySelectorAll('.PopupLink[id^="bEdit"]');
                                        if (!currentParentIndex) {
                                            localStorage.setItem("parentLibraryIds", "[]");
                                            currentParentIndex = parentEditLinks.length - 1;
                                        }
                                        let toEval = parentEditLinks[currentParentIndex].href.slice(11).replaceAll("%22", '"').split("?");
                                        toEval[1] = "action=initializeStudent&" + toEval[1];
                                        toEval = toEval.join("?");
                                        eval(toEval);
                                        currentParentIndex--;
                                        localStorage.setItem("currentParentIndex", currentParentIndex);
                                    }
                                } else {
                                    loadTab("fam");
                                }
                            } else if (students[0]["House"] === "") {
                                if (hCurrentTab.value === "discat") {
                                    students[0]["House"] = "Pending";
                                    localStorage.setItem("studentsPending", JSON.stringify(students));
                                    openNewWindow("sstudcatedit001.w?vCategoryEntity=000&vDetailType=General&action=initializeStudent", 655, 460, 0, "select");
                                } else {
                                    loadTab("discat");
                                }
                            }
                        }
                    } else {
                        tCurrentNameKey.value = students[0]["Alpha Key"];
                        refreshTabs();
                    }
                }
            } else {
                const hCurrentTab = document.getElementById("hCurrentTab");
                if (hCurrentTab.value === "prfl") {
                    // Show Initialize Students Button
                    const initStudentButton = document.createElement("a");
                    initStudentButton.className = "button";
                    initStudentButton.style = "top: 180px; position: relative";
                    initStudentButton.href = "javascript:;";
                    initStudentButton.innerText = "Initialize Students";
                    document.getElementById("bLog").after(initStudentButton);
                    initStudentButton.addEventListener("click", async () => {
                        let result = await jsonpCall2("action=jsonpGetPendingStudents");
                        if (result.success.rows.some(student => 
                            student["Email"] === "" ||
                            student["Active Directory"] === "" ||
                            student["Google Workspace"] === "" ||
                            student["Moodle"] === ""
                        )) {
                            alert("Please run Powershell script first before you can continue.");
                        } else {
                            localStorage.setItem("studentsPending", JSON.stringify(result.success));
                            refreshTabs();
                        }
                    });
                }
            }
        } else if (urlParams.activeScreen === "sstudgenedit001.w" && urlParams.action === "initializeStudent") {
            (async () => {
                let students = JSON.parse(localStorage.getItem("studentsPending"));
                // Library Card
                const vLibraryCardNo = document.getElementById("vLibraryCardNo");
                if (vLibraryCardNo.value === "" && students[0]["Library Id"].toString() === "") {
                    let result = await jsonpCall("action=jsonpGetLibraryCardNo");
                    vLibraryCardNo.value = result.success;
                    students[0]["Library Id"] = result.success;
                    localStorage.setItem("studentsPending", JSON.stringify(students));
                    await jsonpCall("action=jsonpUpdateDB&table=Students&alphaKey=" + students[0]["Alpha Key"] + "&column=Library Id&value=" + result.success);
                } else if (vLibraryCardNo.value === "") {
                    vLibraryCardNo.value = students[0]["Library Id"];
                } else if (students[0]["Library Id"].toString() === "" || vLibraryCardNo.value !== students[0]["Library Id"].toString()) {
                    await jsonpCall("action=jsonpUpdateDB&table=Students&alphaKey=" + students[0]["Alpha Key"] + "&column=Library Id&value=" + vLibraryCardNo.value);
                }
                // Email (SW Profile)
                const vSchoolEmail = document.getElementById("vSchoolEmail");
                if (vSchoolEmail.value === "" || vSchoolEmail.value !== students[0]["Email"]) {
                    vSchoolEmail.value = students[0]["Email"];
                }
                students[0]["SW Profile"] = "Done";
                localStorage.setItem("studentsPending", JSON.stringify(students));
                await jsonpCall("action=jsonpUpdateDB&table=Students&alphaKey=" + students[0]["Alpha Key"] + "&column=SW Profile&value=Done");

                validateForm("edit","sstudgenhttp001.w","close");
                setTimeout(() => {
                    window.close();
                }, 5000)
            })();
        } else if (urlParams.activeScreen === "sfmlybrws001.w") {
            if (urlParams.recID) {
                document.getElementById("recID").value = urlParams.recID;
                document.getElementById("encrecID").value = urlParams.encrecID;
                openNewWindow('sspusedit003.w',1024,768,1,'',0,1);
            } else if (urlParams.lastName) {
                // ***** AVAILABLE TO ALL USERS *****
            } else {
                // ***** AVAILABLE TO ALL USERS *****
            }
        } else if (urlParams.activeScreen === "sstudfamedit002.w" && urlParams.action === "initializeStudent") {
            (async () => {
                let vWorkHours = document.getElementById("vWorkHours");
                if (vWorkHours.value === "") {
                    let result = await jsonpCall("action=jsonpGetLibraryCardNo");
                    vWorkHours.value = result.success;
                }
                let parentLibraryIds = JSON.parse(localStorage.getItem("parentLibraryIds"));
                parentLibraryIds.push(vWorkHours.value);
                localStorage.setItem("parentLibraryIds", JSON.stringify(parentLibraryIds));
                let bSave = document.getElementById("bSave");
                bSave.click();
            })();
        } else if (urlParams.activeScreen === "ssauedit001.w" && urlParams.action === "initializeStudent") {
            (async () => {
                const students = JSON.parse(localStorage.getItem("studentsPending"));
                const vSchoolEmail = document.getElementById("vSchoolEmail");
                const tUserId = document.getElementById("tUserId");
                const tStudent = document.getElementById("tStudent");
                const tPass = document.getElementById("tPass");
                const tPassword = document.getElementById("tPassword");
                const cAllowAccess = document.getElementById("cAllowAccess");
                vSchoolEmail.value = students[0]["Email"];
                tUserId.value = students[0]["Email"];
                if (tPass && tPass.readOnly) {
                    const bSetPassword = document.getElementById("bSetPassword");
                    bSetPassword.click();
                    const tNewPassword = document.getElementById("tNewPassword");
                    tNewPassword.value = tStudent.value.split(" ")[0] + "Generic1";
                } else {
                    tPassword.value = tStudent.value.split(" ")[0] + "Generic1";
                }
                cAllowAccess.checked = true;
                await jsonpCall("action=jsonpUpdateDB&table=Students&alphaKey=" + students[0]["Alpha Key"] + "&column=SW Web Access&value=Done");
                students[0]["SW Web Access"] = "Done";
                localStorage.setItem("studentsPending", JSON.stringify(students));
                checkSave("edit","ssauhttp001.w","close");
            })();
        } else if (urlParams.activeScreen === "ssusrbrws001.w") {
            if (urlParams.supervisors === "1") {
                // Hooker
                document.getElementById("recID").value = "0x000000002c3cb20b";
                document.getElementById("encrecID").value = "baSGjnWKiKkanpcd";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Tanas
                document.getElementById("recID").value = "0x000000001244704b";
                document.getElementById("encrecID").value = "dakdRaidjtdyhpkk";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Perakis
                document.getElementById("recID").value = "0x00000000000a5fd4";
                document.getElementById("encrecID").value = "baZdTlpldbVicjfO";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Aroni
                document.getElementById("recID").value = "0x000000001e8bb212";
                document.getElementById("encrecID").value = "nikLFPgfjyCamlca";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Maravegias Natalia
                document.getElementById("recID").value = "0x000000000646399f";
                document.getElementById("encrecID").value = "SkniijjpQDdaNokd";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Makris Anna
                document.getElementById("recID").value = "0x0000000000829e41";
                document.getElementById("encrecID").value = "jhTXlllipXjazHGF";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Evloyias Evangelia
                document.getElementById("recID").value = "0x0000000002b6e063";
                document.getElementById("encrecID").value = "DlZfclvdacWcukbj";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Leonardatos
                document.getElementById("recID").value = "0x000000003681808d";
                document.getElementById("encrecID").value = "iUMdlNlklllmcXbS";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Schoenefeld
                document.getElementById("recID").value = "0x0000000000d900c1";
                document.getElementById("encrecID").value = "cmmufIiyijdhhbUb";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Kordolaimi
                document.getElementById("recID").value = "0x000000000052fecc";
                document.getElementById("encrecID").value = "kljiidOcbPxIpyBb";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Tzanetakos
                document.getElementById("recID").value = "0x0000000002487255";
                document.getElementById("encrecID").value = "riicjtCIfkkdBiig";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Embrock Michael
                document.getElementById("recID").value = "0x000000002dcdbd1a";
                document.getElementById("encrecID").value = "htFdokicRolncciM";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Andrikopoulos
                document.getElementById("recID").value = "0x00000000000a86be";
                document.getElementById("encrecID").value = "wadpfXkEvdjTdWjy";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Constantinides
                document.getElementById("recID").value = "0x00000000000a5fc6";
                document.getElementById("encrecID").value = "hpfiacZalfmjjRlc";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Papadakis
                document.getElementById("recID").value = "0x00000000000a6060";
                document.getElementById("encrecID").value = "ddmclbPlblacPipb";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Manos
                document.getElementById("recID").value = "0x0000000002af51c7";
                document.getElementById("encrecID").value = "CifiplUhlxPbabYi";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Tokatlidou
                document.getElementById("recID").value = "0x00000000000a2387";
                document.getElementById("encrecID").value = "bdfAjTviiOiabijj";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Fragkou
                document.getElementById("recID").value = "0x000000000c18aa91";
                document.getElementById("encrecID").value = "dpijccXcEaccGcXd";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Kakaris Stefanos
                document.getElementById("recID").value = "0x00000000000a5fbf";
                document.getElementById("encrecID").value = "pOdhppcTiiOjNeki";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Pelonis
                document.getElementById("recID").value = "0x00000000000a5e85";
                document.getElementById("encrecID").value = "buNaldptapWldsda";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
                // Augoustatos
                document.getElementById("recID").value = "0x00000000000a5e2b";
                document.getElementById("encrecID").value = "jkcYiSpkiviKdcll";
                openNewWindow('sspusedit003.w?allLogin=yes',1024,768,1,'',0,2);
            }
        } else if (urlParams.activeScreen === "sstudcatedit001.w" && urlParams.action === "initializeStudent") {
            (async () => {
                const students = JSON.parse(localStorage.getItem("studentsPending"));
                let house;
                let elems = document.querySelectorAll("input[checked]");
                for (let i in elems) {
                    if (elems[i].parentElement) {
                        if (elems[i].parentElement.parentElement.parentElement.children[1].innerText === "HOU" && elems[i].parentElement.parentElement.parentElement.children[3]) {
                            house = elems[i].parentElement.parentElement.parentElement.children[3].innerText;
                            break;
                        }
                    }
                }
                if (house) {
                    await jsonpCall("action=jsonpUpdateDB&table=Students&alphaKey=" + students[0]["Alpha Key"] + "&column=House&value=" + house);
                    checkSave('edit','sstudcathttp001.w','close','');
                } else {
                    let result = await jsonpCall("action=jsonpGetHouseForStudent&table=Students&fullName=" + students[0]["Full Name"] + "&graduationYear=" + students[0]["Graduation Year"]);
                    if (result && result.success) {
                        let houseRows = document.querySelectorAll('[delinfo="HOU"]');
                        for (i in houseRows) {
                            if (houseRows[i].children[3].innerText === result.success) {
                                houseRows[i].children[0].querySelector("input").click();
                                students[0]["House"] = result.success;
                                localStorage.setItem("studentsPending", JSON.stringify(students));
                                await jsonpCall("action=jsonpUpdateDB&table=Students&alphaKey=" + students[0]["Alpha Key"] + "&column=House&value=" + result.success);
                                checkSave('edit','sstudcathttp001.w','close','');
                                break;
                            }
                        }
                    } else {
                        // alert("No House Found");
                        checkSave('edit','sstudcathttp001.w','close','');
                    }
                }
            })();
        }
    } else if (duserid.value === "rontogiannisl" || duserid.value === "efstathiouv") {
        const custfrmsAs = document.querySelectorAll("#custfrmsdiv a");
        for (let i in custfrmsAs) {
            if (custfrmsAs[i].innerText === "Employee Non-Disclosure Agreement") {
                custfrmsAs[i].parentElement.remove();
                break;
            }
        }
    }
}

async function scriptCall(params) {
    return new Promise(resolve => {
        const script = document.createElement("script");
        script.src = "https://script.google.com/macros/s/AKfycbzlXMEjhuzIRXLKgRLoQxzJTxw96YCu7k9GkReiyPu2IOXEnK575iKrNBxAAoADTLh9jg/exec?" + params;
        document.body.append(script);
        script.onload = () => {
            if (scriptCallResult && scriptCallResult.success) {
                resolve(scriptCallResult);
            }
        }
    });
}

async function jsonpCall(params) {
    return new Promise(resolve => {
        const script = document.createElement("script");
        script.src = "https://script.google.com/macros/s/AKfycbwHa3kK0PJLBba7JDVW5Io1tnJ92ouWBNJuoIZ_p5_yyTl4IfsaxRhnI1vPe-rxrESl/exec?" + params;
        console.log(script.src);
        document.body.append(script);
        script.onload = () => {
            if (jsonpCallResult && jsonpCallResult.success) {
                resolve(jsonpCallResult);
            } else {
                console.log("jsonpCallResult", jsonpCallResult);
                resolve(jsonpCallResult);
            }
        }
    });
}

async function jsonpCall2(params) {
    return new Promise(resolve => {
        const script = document.createElement("script");
        script.src = "https://script.google.com/macros/s/AKfycby2f40V1z9X4ensvBnDF_WwBZW96Y529osXFS8HC5InDWfT64F9sOuSFFgDRbeU6lVB6Q/exec?" + params;
        console.log(script.src);
        document.body.append(script);
        script.onload = () => {
            if (jsonpCallResult && jsonpCallResult.success) {
                resolve(jsonpCallResult);
            } else {
                console.log("jsonpCallResult", jsonpCallResult);
                resolve(jsonpCallResult);
            }
        }
    });
}