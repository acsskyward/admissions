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

completeStep(3,false);
completeStep(4,false);
completeStep(5,false);

{ // Observer Related Changes
    const toRemove = [
        { selector: '[for="StuInfoSchooltoEnrollinto"]',},
        { selector: '[for="GurInfoHomeAddress1Dir"]', parent: true },
        { selector: '[for="GurInfoHomeAddress1SUDNum"]', parent: true },
        { selector: '#GurInfoHomeAddress2Dir', parent: true },
        { selector: '#GurInfoHomeAddress2SUDNum', parent: true },
        { selector: '#GurInfoMailingAddress2Dir', parent: true },
        { selector: '#GurInfoMailingAddress2SUDNum', parent: true },
        { selector: '[for="GurInfoMailingAddress1Dir"]', parent: true},
        { selector: '[for="GurInfoMailingAddress1SUDNum"]', parent: true},
        { selector: '[for="GurInfoHomeAddress2Dir"]', parent: true},
        { selector: '[for="GurInfoHomeAddress2SUDNum"]', parent: true},
        { selector: '[for="GurInfoMailingAddress2Dir"]', parent: true},
        { selector: '[for="GurInfoMailingAddress2SUDNum"]', parent: true},
    ];

    let toHide = [
        { selector: '#bSaveStep1' },
        { selector: '#bComplete1' },
        { selector: '#bSaveStep2' },
        { selector: '#bComplete2' },
        { selector: '#bSaveStep3' },
        { selector: '#bComplete3' },
        { selector: '#bSaveStep4' },
        { selector: '#bComplete4' },
        { selector: '#bSaveStep5' },
        { selector: '#bComplete5' },
        { selector: '#bSaveStep6' },
        // { selector: '#bView1' },
        // { selector: '#bView2' },
        // { selector: '#bView3' },
        // { selector: '#bView4' },
        // { selector: '#bView5' },
        // { selector: '#bView6' }
    ];
    if (urlParams.hMode !== "View") {
        toHide.push (
            { selector: '#bView1' },
            { selector: '#bView2' },
            { selector: '#bView3' },
            { selector: '#bView4' },
            { selector: '#bView5' },
            { selector: '#bView6' }
        );
    }

    const toReplace = [
        {
            selector: '#labelStuInfoGender',
            html: '<span class="sf_requiredSpan" tooltip="This is a required field." tooltip-position="left">*</span>Gender:'
        }, {
            selector: '[for="StuInfoPreviousSchl"]',
            html: '<span class="sf_requiredSpan" tooltip="This is a required field." tooltip-position="left">*</span>Name of School Currently Attending:'
        }, {
            selector: '#SchYrSection label',
            html: '<span class="sf_requiredSpan" tooltip-position="left" tooltip="This is a required field.">*</span><strong>What School Year is this student interested in applying for?</strong>'
        }, {
            selector: '#grid_CustInstruct th',
            html: 'Instructions for completing the Additional Forms'
        // }, {
        //     selector: '#GurInfoMaritalStatus1_1',
        //     html: '<option value="" selected="selected"></option><option value="S">Single</option><option value="M">Married</option><option value="D">Divorced</option><option value="P">Separated</option><option value="W">Widowed</option>'
        // }, {
        //     selector: '#GurInfoMaritalStatus2_1',
        //     html: '<option value="" selected="selected"></option><option value="S">Single</option><option value="M">Married</option><option value="D">Divorced</option><option value="P">Separated</option><option value="W">Widowed</option>'
        // }, {
        //     selector: '#GurInfoMaritalStatus2_2',
        //     html: '<option value="" selected="selected"></option><option value="S">Single</option><option value="M">Married</option><option value="D">Divorced</option><option value="P">Separated</option><option value="W">Widowed</option>'
        }
    ];

    const toRunOnce = [
        // Move Grade Level next to Date of Birth
        () => {
            let refElement = document.querySelector("#StuInfoDateofBirth").parentElement.parentElement;
            let gradeInputElementParent = document.querySelector("#StuInfoExpectedGradeLevel").parentElement;
            if (document.querySelector('[for="StuInfoBirthCity"]')) {
                refElement.insertBefore(gradeInputElementParent, document.querySelector('[for="StuInfoBirthCity"]').parentElement);
                refElement.insertBefore(document.querySelector('[for="StuInfoExpectedGradeLevel"]').parentElement, gradeInputElementParent)
                return true;
            }
        },
        () => {
            if (document.querySelector('#bSubmit')) {
                document.querySelector('#bSubmit').addEventListener("click", (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    completeStep(6, false);
                    checkSave('submit');
                });
                return true;
            }
        }
    ];

    const observer = new MutationObserver((mutations) => {

        { // Replace Application With Request in the Dialog Title
            document.querySelectorAll(".sf_DialogTitle").forEach((element) => {
                if (element.innerText.match(/application/i)) {
                    element.innerText = element.innerText
                        .replace("application", "request")
                        .replace("Application", "Request")
                        .replace("an Application", "a Request");
                }
            });
            // Replace Application With Request in the Dialog Text
            document.querySelectorAll(".sf_DialogHtml").forEach((element) => {
                if (element.innerHTML.match(/application/i)) {
                    element.innerHTML = element.innerHTML
                        .replace("an Application", "a Request")
                        .replace("Application", "Request")
                        .replace("application", "request");
                    if (currentRequestFor === "050") {
                        element.innerHTML = element.innerHTML.replace("6", "3");
                    } else if (currentRequestFor === "500") {
                        element.innerHTML = element.innerHTML.replace("6", "5");
                    }
                }
            });
        }
    
        toRemove.forEach((item) => {
            let element = document.querySelector(item.selector);
            if (element) {
                if (item.parent) {
                    element.parentElement.remove();
                } else {
                    element.remove();
                }
            }
        });
    
        toHide.forEach((item) => {
            let element = document.querySelector(item.selector);
            if (element && element.style.visibility !== "none") {
                element.style.display = "none";
            }
        });
    
        // Replace
        for (let i = 0; i < toReplace.length; i++) {
            let element = document.querySelector(toReplace[i].selector);
            if (element) {
                if (toReplace[i].parent) {
                    element.parentElement.innerHTML = toReplace[i].html;
                } else {
                    element.innerHTML = toReplace[i].html;
                }
                toReplace.splice(i, 1);
                i--;
            }
        }
    
        // Run Once
        for (let i = 0; i < toRunOnce.length; i++) {
            let result = toRunOnce[i]();
            if (result) {
                toRunOnce.splice(i, 1);
                i--;
            }
        }
    
        document.querySelectorAll('.button').forEach((button) => {
            if (button.style.backgroundColor === "") {
                button.style.backgroundColor = "#002f6c";
                button.style.color = "white";
                if (button.id !== "bComplete6" && button.id !== "bSubmit") {
                    button.style.fontSize = "13px";
                } else {
                    button.style.fontSize = "20px";
                }
            }
        });
    
        updateStates('#GurInfoHomeAddress2State');
        updateStates('#GurInfoMailingAddress2State');
        updateStates('#GurInfoHomeAddress3State');
        updateStates('#GurInfoMailingAddress3State');
    
        let element;
        if (currentRequestFor === "050") {
            element = document.querySelector('[tooltip="Step 6 is currently being edited.  Only one step may be edited at a time."]');
            if (element) {
                element.setAttribute("tooltip", "Step 3 is currently being edited.  Only one step may be edited at a time.");
            }
            element = document.querySelector('#bMove2');
            if (element.innerHTML.slice(-27) === "Allergy/Medical Information") {
                element.innerHTML = "No, Complete Step 2 and move to Step 3: Additional Forms";
            }
            element = document.querySelector('#grid_emerinfo .sf_text');
            if (element.firstChild.nodeValue !== "Step 3: Allergy/Medical Information") {
                // element.firstChild.nodeValue = "Step 3: Allergy/Medical/Dietary Information";
            }
            element = document.querySelector('#grid_custinfo .sf_text');
            if (element.firstChild.nodeValue !== "Step 3: Additional Forms") {
                element.firstChild.nodeValue = "Step 3: Additional Forms";
            }
        } else if (currentRequestFor === "100" || currentRequestFor === "") {
            element = document.querySelector('#bMove2');
            if (element.innerHTML.slice(-16) === "Additional Forms") {
                // element.innerHTML = "No, Complete Step 2 and move to Step 3: Allergy/Medical/Dietary Information";
            }
            element = document.querySelector('#bMove2');
            if (element.innerHTML.slice(-18) === "Dental Information") {
                element.innerHTML = "No, Complete Step 2 and move to Step 3: Allergy/Medical/Dietary Information";
            }
            element = document.querySelector('#bMove5');
            if (element.innerHTML.slice(-14) === "District Forms") {
                element.innerHTML = "Complete Step 5 and move to Step 6: Additional Forms";
            }
            element = document.querySelector('#grid_emerinfo .sf_text');
            if (element.firstChild.nodeValue !== "Step 3: Allergy/Medical Information") {
                element.firstChild.nodeValue = "Step 3: Allergy/Medical/Dietary Information";
            }
            element = document.querySelector('#grid_custinfo .sf_text');
            if (element.firstChild.nodeValue !== "Step 6: Additional Forms") {
                element.firstChild.nodeValue = "Step 6: Additional Forms";
            }
        }
    
        element = document.querySelectorAll(".calendly-inline-widget");
        if (element && element.length > 1) {
            element[1].parentElement.style.width = "665px";
            element[1].parentElement.style.maxHeight = "revert";
            sff.dialog.reposition();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// This should be in the section below but Safari doesn't see it and throws exception...
const customCompleteButtonHandlers = {
    custom2to6: (event) => {
        event.preventDefault();
        event.stopPropagation();
        completeStep2Custom(2, true, 6, event);
    },
    custom4to6: (event) => {
        event.preventDefault();
        event.stopPropagation();
        completeStep2Custom(4, true, 6, event);
    }
};

{ // Number of Steps changer
    function updateSectionLabelStepNumber(originalStepNumber, newStepNumber) {
        if (originalStepNumber === 6) {
            const elem = document.querySelector('#grid_custinfo .sf_text').firstChild;
            elem.nodeValue = elem.nodeValue.replace(/\d(?=:)/, newStepNumber);
        }
    }

    function updateCompleteButtonCaption(captionStart, buttonId, originalStepNumber) {
        let sectionLabel;
        if (originalStepNumber === 3) {
            sectionLabel = document.querySelector('#emerinfo .sf_text').firstChild.textContent;
        } else if (originalStepNumber === 5) {
            sectionLabel = document.querySelector('#attachinfo .sf_text').firstChild.textContent;
        } else if (originalStepNumber === 6) {
            sectionLabel = document.querySelector('#grid_custinfo .sf_text').firstChild.textContent;
        } else {
            document.getElementById(buttonId).innerHTML = `${captionStart}`;
            return;
        }
        document.getElementById(buttonId).innerHTML = `${captionStart} ${sectionLabel}`;
    }

    function completeStep2Custom(pStep, pMoveOn, pMoveToOriginalStep, event) {
        event.preventDefault();
        event.stopPropagation();

        if (gWaiting)
            return;
        var vVal = 'All';
        if (pStep >= 1 && pStep <= 7) {
            vVal = sff.getValue("stepType" + pStep);
        }
        if (finalValidate('step', vVal)) {
            document.getElementById("Complete" + pStep).innerHTML = "<img src='/webspeed/green-checkmark.png' alt='Completed' style='width:14px;vertical-align:-3px'/>Date Completed: 11/14/2023";
            var reOpenImm = (vVal == "Stu" && vImmStep != "" && sff.trim($("#Complete" + vImmStep).html()) != "" && !finalValidate(pMoveOn, "Imm"));
            if (reOpenImm) {
                $("#Complete" + vImmStep).html("");
            }
            closeStep(pStep);
            if (vCustStep > 0) {
                var i = 1;
                while (document.getElementById('Complete' + i)) {
                    if (i == vCustStep) {
                        sff.enable("bView" + i);
                        sff.enable("bEdit" + i);
                        $("#CustMsg").hide();
                    } else if (document.getElementById('Complete' + i).innerHTML.replace(/^\s\s*/, '').replace(/\s\s*$/, '') == '')
                        break;
                    i++;
                }
            }
            if (reOpenImm) {
                editStep(vImmStep);
            } else if (pMoveOn) {
                editStep((pMoveToOriginalStep));
            }
        } else {
            $("#Step" + pStep).find('[required=required]').each(function() {
                checkRequired(this)
            });
        }

    }

    function updateCompleteButtonHandler(buttonId, nextStep, customizeEvent) {;
        const elem = document.getElementById(buttonId);
        if (customizeEvent) {
            if (buttonId === 'bMove2' && nextStep === 6) {
                elem.addEventListener("click", customCompleteButtonHandlers.custom2to6);
            } else if (buttonId === 'bMove4' && nextStep === 6) {
                elem.addEventListener("click", customCompleteButtonHandlers.custom4to6);
            }
        } else {
            elem.removeEventListener("click", customCompleteButtonHandlers.custom2to6);
            elem.removeEventListener("click", customCompleteButtonHandlers.custom4to6);
        }
    }
}

const show = {
    birthState: (visible) => {
        if (visible) {
            const birthStateTd = document.getElementById("StuInfoBirthState").parentElement;
            const birthStateLabelTd = birthStateTd.previousElementSibling;
            birthStateTd.style.display = "table-cell";
            birthStateLabelTd.style.display = "table-cell";
        } else {
            const birthStateTd = document.getElementById("StuInfoBirthState").parentElement;
            const birthStateLabelTd = birthStateTd.previousElementSibling;
            birthStateTd.style.display = "none";
            birthStateLabelTd.style.display = "none";
        }
    },
    schoolYearApplyingFor: (visible) => {
        if (visible) {
            document.getElementById('StuInfoExpectedDateofEnroll').value = "";
            document.querySelector("#SchYrSection").style.display = "block";
        } else {
            document.getElementById('StuInfoExpectedDateofEnroll').value = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
            document.querySelector("#SchYrSection").style.display = "none";
        }
    },
    additionalInformation: (visible) => {
        if (visible) {
            document.getElementById("tEnrollCmnt").parentElement.parentElement.style.display = "table-row";
        } else {
            document.getElementById("tEnrollCmnt").parentElement.parentElement.style.display = "none";
        }
    },
    medicalSection: (visible) => {
        if (visible) {
            document.getElementById("emerinfo").style.display = "revert";
        } else {
            document.getElementById("emerinfo").style.display = "none";
        }
    },
    emergecyContactsSection: (visible) => {
        if (visible) {
            document.getElementById("ecinfo").style.display = "revert";
        } else {
            document.getElementById("ecinfo").style.display = "none";
        }
    },
    documentsSection: (visible) => {
        if (visible) {
            document.getElementById("attachinfo").style.display = "revert";
        } else {
            document.getElementById("attachinfo").style.display = "none";
        }
    },
}

const requestFor = {
    schoolAdmission: (selected) => {
        if (selected) {
            currentRequestFor = "100";
        } else {
        }
    },
    schoolVisit: (selected) => {
        if (selected) {
            show.schoolYearApplyingFor(false);
            show.medicalSection(false);
            show.emergecyContactsSection(false);
            show.documentsSection(false);
    
            updateSectionLabelStepNumber(6, 3);
            updateCompleteButtonCaption("No, Complete Step 2 and move to", "bMove2", 6);
            updateCompleteButtonHandler("bMove2", 6, true);
            updateCompleteButtonCaption("Complete Step 3", "bComplete6");
            // Update customizable Original Step 6 text
            document.querySelector("#Step6 .instructarea").innerHTML = document.querySelector("#Step6 .instructarea").innerHTML.replace("Complete Step 6", "Complete Step 3");
            // Enable Calendly
            document.querySelector("#afterSubmitMessage").innerHTML = `<div class="calendly-inline-widget" data-url="https://calendly.com/d/3h3-4z3-r47/meeting-visit-request" style="min-width:320px;height:961px;"></div><script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async><\/script>`;

            currentRequestFor = "050";
        } else {
            show.schoolYearApplyingFor(true);
            show.medicalSection(true);
            show.emergecyContactsSection(true);
            show.documentsSection(true);
    
            updateSectionLabelStepNumber(6, 6);
            updateCompleteButtonCaption("No, Complete Step 2 and move to", "bMove2", 3);
            updateCompleteButtonHandler("bMove2", 6, false);
            updateCompleteButtonCaption("Complete Step 6", "bComplete6");
            // Revert customizable Original Step 6 text
            document.querySelector("#Step6 .instructarea").innerHTML = document.querySelector("#Step6 .instructarea").innerHTML.replace("Complete Step 3", "Complete Step 6");
            // Disable Calendly
            document.querySelector("#afterSubmitMessage").innerHTML = originalAfterSubmitMessage;
        }
    },
    summerCamp: (selected) => {
        if (selected) {
            show.birthState(false);
            show.additionalInformation(false);
            show.schoolYearApplyingFor(false);
            show.documentsSection(false);
            defaultGrade = () => {
                var vToday     = new Date;
                var vBirthdate = new Date(document.getElementById("StuInfoDateofBirth").value);
                var vAge       = vToday.getFullYear() - vBirthdate.getFullYear();
                if (vToday.getMonth() < vBirthdate.getMonth() ||
                    vToday.getMonth() == vBirthdate.getMonth() && vToday.getDate() < vBirthdate.getDate()) {
                    vAge -= 1;
                }
                document.getElementById("tAge").value = vAge;
                if (document.getElementById("tAge").value == 'NaN')
                    document.getElementById("tAge").value = '0';
                if (document.getElementById("StuInfoExpectedGradeLevel") && document.getElementById("StuInfoExpectedGradeLevel").value == "") {
                    var vDOB = document.getElementById("StuInfoDateofBirth").value.split("/");
                    var vTempCut = document.getElementById("hEnrollCutoff").value;
                    if (vTempCut < 5) vTempCut = vTempCut.substring(0,1) + "/" + vTempCut.substring(2);
                    var vCut = vTempCut.split("/");
                    if (vDOB.length > 2 && vCut.length > 1) {
                        if (parseInt(vDOB[0]) < parseInt(vCut[0]) || (parseInt(vDOB[0]) == parseInt(vCut[0]) && parseInt(vDOB[1]) < parseInt(vCut[1])))
                            var vGY = parseInt(vDOB[2]) + 18;
                        else
                            var vGY = parseInt(vDOB[2]) + 19;
                        var hSchYrEnrl = $('#hSchYrEnrl').val();
                        var rSchYrEnrl = $('input[name="rSchYrEnrl"]:checked').val();
                        var vNYSchYr   = parseInt($('#hSchoolYear').val(),10) + 1;
                        if (rSchYrEnrl == vNYSchYr || hSchYrEnrl == vNYSchYr) {  //use the next year list
                            var vSchYr = "Next";
                            var vGYList = document.getElementById("hNYGYList").value.split(",");
                            var vGRList = document.getElementById("hNYGRList").value.split(",");
                        }
                        else {  //use the current year list
                            var vSchYr = "Current";
                            var vGYList = document.getElementById("hGYList").value.split(",");
                            var vGRList = document.getElementById("hGRList").value.split(",");
                        }
                        if ($.inArray(String(vGY),vGYList) > -1) {
                            document.getElementById("StuInfoExpectedGradeLevel").value = vGRList[$.inArray(String(vGY),vGYList)];
                            checkCustomForms();
                        }
                    }
                }
            }
    
            updateSectionLabelStepNumber(6, 5);
            updateCompleteButtonCaption("No, Complete Step 4 and move to", "bMove4", 6);
            updateCompleteButtonHandler("bMove4", 6, true);
            updateCompleteButtonCaption("Complete Step 5", "bComplete6");
            // Update customizable Original Step 6 text
            document.querySelector("#Step6 .instructarea").innerHTML = document.querySelector("#Step6 .instructarea").innerHTML.replace("Complete Step 6", "Complete Step 5");
            // Enable Custom Pre and After Submit Message
            document.querySelector("#submitMessage").innerHTML = '\x3Cscript>continueSave("submit");\x3C/script>';
            document.querySelector("#afterSubmitMessage").innerHTML =
            `<div style="text-align:center;">You will receive an answer within one business day.
            <br><br>
            For students entering Grade 3 and above you will then be able to proceed to activity selection</div>
            <br><hr>
            <div style="text-align:center;"><a role="button" id="bOK3" name="bOK3" class="button" style="padding:3px 30px" href="javascript:void(0)">OK</a></div>`;

            currentRequestFor = "500";
        } else {
            show.birthState(true);
            show.additionalInformation(true);
            show.schoolYearApplyingFor(true);
            show.documentsSection(true);
            defaultGrade = originalDefaultGrade;

            updateSectionLabelStepNumber(6, 6);
            updateCompleteButtonCaption("No, Complete Step 4 and move to", "bMove4", 5);
            updateCompleteButtonHandler("bMove4", 6, false);
            updateCompleteButtonCaption("Complete Step 6", "bComplete6");
            // Revert customizable Original Step 6 text
            document.querySelector("#Step6 .instructarea").innerHTML = document.querySelector("#Step6 .instructarea").innerHTML.replace("Complete Step 5", "Complete Step 6");
            // Restore Original Pre and After Submit Message
            document.querySelector("#submitMessage").innerHTML = originalPreSubmitMessage;
            document.querySelector("#afterSubmitMessage").innerHTML = originalAfterSubmitMessage;
        }
    },
    virtualCourses: (selected) => {
        if (selected) {
            show.schoolYearApplyingFor(false);
            show.medicalSection(false);
            show.emergecyContactsSection(false);
            show.documentsSection(false);

            updateSectionLabelStepNumber(6, 3);
            updateCompleteButtonCaption("No, Complete Step 2 and move to", "bMove2", 6);
            updateCompleteButtonHandler("bMove2", 6, true);
            updateCompleteButtonCaption("Complete Step 3", "bComplete6");
            // Update customizable Original Step 6 text
            document.querySelector("#Step6 .instructarea").innerHTML = document.querySelector("#Step6 .instructarea").innerHTML.replace("Complete Step 6", "Complete Step 3");

            currentRequestFor = "600";
        } else {
            show.schoolYearApplyingFor(true);
            show.medicalSection(true);
            show.emergecyContactsSection(true);
            show.documentsSection(true);

            updateSectionLabelStepNumber(6, 6);
            updateCompleteButtonCaption("No, Complete Step 2 and move to", "bMove2", 3);
            updateCompleteButtonHandler("bMove2", 6, false);
            updateCompleteButtonCaption("Complete Step 6", "bComplete6");
            // Revert customizable Original Step 6 text
            document.querySelector("#Step6 .instructarea").innerHTML = document.querySelector("#Step6 .instructarea").innerHTML.replace("Complete Step 3", "Complete Step 6");
        }
    }
}

setTimeout(() => {
    if (!localStorage.getItem('capitalizationShown')) {
        localStorage.setItem('capitalizationShown', true);
        sff.dialog.show({
            'title': 'Request Form Instructions',
            'modal': true,
            'html': '<div style="text-align: center">Please use normal capitalization when filling out this form.<br><strong>Do not use all capital letters.</strong><br><br>Thank you for your cooperation.<br><br><a class="button" style="padding:3px 30px;" onclick="sff.dialog.hide();">OK</a></div>'
        });
    }

    if (document.querySelector('#StuInfoSchooltoEnrollinto').value === "100") {
        requestFor.schoolAdmission(true);
    } else if (document.querySelector('#StuInfoSchooltoEnrollinto').value === "050") {
        requestFor.schoolVisit(true);
    } else if (document.querySelector('#StuInfoSchooltoEnrollinto').value === "500") {
        requestFor.summerCamp(true);
    } else if (document.querySelector('#StuInfoSchooltoEnrollinto').value === "600") {
        requestFor.virtualCourses(true);
    }

    document.querySelector('#StuInfoSchooltoEnrollinto').addEventListener("change", (event) => {
        if (currentRequestFor === "100" || currentRequestFor === "") {
            requestFor.schoolAdmission(false);
        } else if (currentRequestFor === "050") {
            requestFor.schoolVisit(false);
        } else if (currentRequestFor === "500") {
            requestFor.summerCamp(false);
        } else if (currentRequestFor === "600") {
            requestFor.virtualCourses(false);
        }
        if (event.target.value === "100" || event.target.value === "") {
            requestFor.schoolAdmission(true);
        } else if (event.target.value === "050") {
            requestFor.schoolVisit(true);
        } else if (event.target.value === "500") {
            requestFor.summerCamp(true);
        } else if (event.target.value === "600") {
            requestFor.virtualCourses(true);
        }
    });

    document.getElementById("StuInfoSchooltoEnrollinto").focus();
}, 500);