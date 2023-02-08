/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([
    "N/currentRecord",
    "N/runtime",
    "N/url",
    "N/record",
    "N/search",
    "N/format",
    "N/ui/dialog",
], function (currentRecord, runtime, url, record, search, format, dialog) {
    function pageInit(context) { }

    function processForm(context) {
        var currRecord = currentRecord.get();
        var systemSetupId = currRecord.getValue("systemsetuprecord");
        var systemSetup = null;
        var initialSetupFields = currRecord.getValue("initialsetup");
        var demoEquip = currRecord.getValue("demoequip");
        var demoItems = currRecord.getValue("demoitems");
        var service = currRecord.getValue("service");
        var travel = currRecord.getValue("travel");
        var serviceZone = currRecord.getValue("servicezone");
        var setServiceZone = currRecord.getValue("setservicezone");
        var plannerboard = currRecord.getValue("plannerboard");
        var summaryCard = currRecord.getValue("summarycard");
        var messages = {
            'systemSetup': [],
            'records': [],
            'bins': [],
            'employees': [],
        };
        var message = "";
        var failed = false;

        if (systemSetupId) {
            var systemSetup = record.load({
                type: "customrecord_cmms_config",
                id: systemSetupId,
                isDynamic: true,
            });
            var webAppVersion = currRecord.getText("webappversion");
        }

        function enableFeature(featureName) {
            try {
                var featureSearch = search.create({
                    type: "customrecord_cmms_feature",
                    filters: [
                        ["custrecord_cmms_feature_system_setup", "is", systemSetupId],
                        "AND",
                        ["custrecord_cmms_feature_module", "is", featureName],
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_cmms_feature_module",
                            label: "name",
                        }),
                    ],
                });

                var results = featureSearch.run().getRange({
                    start: 0,
                    end: 3,
                });

                if ((results.length = 1)) {
                    var featureId = results[0].id;
                    record.submitFields({
                        type: "customrecord_cmms_feature",
                        id: featureId,
                        values: {
                            custrecord_cmms_feature_is_enabled: true,
                        },
                    });
                } else {
                    log.error(
                        "Error",
                        "More than one feature found in enableFeature() search."
                    );
                }
            } catch (error) {
                log.error("Error in enableFeature()", error);
            }
        }

        function setFieldValue(fieldName, value) {
            try {
                systemSetup.setValue({
                    fieldId: fieldName,
                    value: value,
                });
            } catch (error) {
                log.error("Error in setFieldValue()", error);
            }
        }

        function setFieldText(fieldName, text) {
            try {
                systemSetup.setText({
                    fieldId: fieldName,
                    text: text,
                });
            } catch (error) {
                log.error("Error in setFieldText()", error);
            }
        }

        if (initialSetupFields) {
            if (!systemSetup) {
                function failureSS(reason) {
                    log.debug("Failure: " + reason);
                }

                dialog
                    .alert({
                        title: "Missing value",
                        message: "Please select System Setup record.",
                    })
                    .catch(failureSS);
            } else {
                try {
                    // Service Order ---------------------------------------------------------
                    setFieldText(
                        "custrecord_cmms_contactsource",
                        "Customer and Project Contacts"
                    );
                    setFieldText(
                        "custrecord_cmms_reopen_cso_functionality",
                        "Revert to C Scheduled and allow grabbing"
                    );
                    setFieldText("custrecord_cmms_default_fulfillmentmodel", "On-site");

                    // Mobile ----------------------------------------------------------------
                    setFieldText(
                        "custrecord_cmms_mapaddressfield",
                        "Requested Customer Address"
                    );
                    setFieldText("custrecord_cs_cmms_homepage", "Service Orders");
                    setFieldValue(
                        "custrecord_cmms_firebase_server_token",
                        "AAAA1Au1DZ0:APA91bER836GHh95SnWwawE4aW7Ua__lqh0nvriFznBilG3ZUnJu7vnyFmoRLvSMaixwHUtliChTKTQpOBINqeygXHrHrfTpvGAF-SLWjKZb-W3dVsNt5i9GeuK51KXGvjoLNpfGEw3y"
                    );
                    setFieldValue(
                        "custrecord_cmms_start_app_blank_date",
                        true
                    );
                    setFieldText("custrecord_cmms_workshop_menu_items", [
                        "Service Orders",
                        "Parts",
                        "Customer Search",
                        "Equipment",
                        "Equipment Search",
                    ]);
                    setFieldText("custrecord_cmms_mobile_optional_tasks", [
                        "Opportunity",
                        "Photos",
                        "Return Items",
                        "Sales Order Parts",
                        "Customer Service History",
                        "Equipment Service History",
                        "Email Service Report",
                        "Attachments",
                        "Switch Service",
                        "Case",
                        "Contacts",
                        "Follow-up Tasks",
                        "Download PDF",
                        "Feedback",
                        "Rental Swap",
                    ]);
                    setFieldText("custrecord_cmms_mobile_req_actions", [
                        "Allocated (svc) Parts",
                        "Asset Condition",
                        "Cases",
                        "Equipment Readings",
                        "Failure Reports",
                        "Parts Delivery",
                        "Parts Used",
                        "PM Task Parts",
                        "PM Tasks",
                        "Quality Checks",
                        "Replacement",
                        "Service Report",
                        "Service Tasks",
                        "Signature",
                        "Switch Service",
                        "Time Entry",
                        "Usage at Completion",
                    ]);

                    // Equipment -------------------------------------------------------------
                    setFieldText("custrecord_cmms_default_eq_read_label", "Set");

                    // Scheduling ------------------------------------------------------------
                    setFieldText(
                        "custrecord_cmms_pb_workstarttime",
                        format.format({
                            value: "8:00",
                            type: format.Type.DATETIMETZ,
                        })
                    );
                    setFieldText(
                        "custrecord_cmms_pb_workendtime",
                        format.format({
                            value: "17:00",
                            type: format.Type.DATETIMETZ,
                        })
                    );
                    setFieldText("custrecord_cmms_pb_editroles", [
                        "Shepherd Administrator",
                        "Administrator",
                    ]);

                    // SO Pipeline -----------------------------------------------------------
                    if (webAppVersion != null && webAppVersion != "") {
                        setFieldText("custrecord_cmms_web_app_virtual_dir", webAppVersion);
                        setFieldText("custrecord_cmms_web_app_version", webAppVersion);
                    }

                    // Defaults -----------------------------------------------------------
                    setFieldText(
                        "custrecord_cmms_dflt_service_order_form",
                        "CMMS Service Order Form V7"
                    );
                    setFieldText("custrecord_cmms_dflt_estimate_form", "CMMS Estimate");
                    setFieldText(
                        "custrecord_cmms_dflt_salesorder_form",
                        "CMMS Sales Order"
                    );
                    setFieldText(
                        "custrecord_cmms_default_invoice_form",
                        "CMMS Service Invoice Form"
                    );
                    setFieldText("custrecord_pm_po_form", "CMMS Purchase Order");
                    setFieldText(
                        "custrecord_cmms_dflt_project_task",
                        "Standard Project Task Form"
                    );

                    systemSetup.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true,
                    });

                    var ssMsg = messages["systemSetup"];
                    ssMsg.push("Initial Required Fields");
                    messages["systemSetup"] = ssMsg;
                } catch (error) {
                    log.debug("Error", error);
                }
                
            }
        }

        // Planner Board ---------------------------------------------------
        if(plannerboard && systemSetupId){

            function createView(name, viewName, days, isdefault, height, showAll, hideTime){
                try {
                    // CMMS Planner Board Views --------------------------------
                    var view = record.create({
                        type: 'customrecord_cmms_pb_views',
                    })
                    view.setValue({
                        fieldId: "custrecord_cmms_pbview_config",
                        value: systemSetupId,
                    });
                    view.setText({
                        fieldId: "custrecord_cmms_pbview_name",
                        text: name,
                    });
                    view.setText({
                        fieldId: "custrecord_cmms_pbview_view",
                        text: viewName,
                    });
                    
                    view.setValue({
                        fieldId: "custrecord_cmms_pbview_no_of_days",
                        value: days,
                    });
                    view.setValue({
                        fieldId: "custrecord_cmms_pbview_default",
                        value: isdefault,
                    });
                    if(height){
                        view.setValue({
                            fieldId: "custrecord_cmms_pbview_event_height",
                            value: height,
                        });
                    }
                    view.setValue({
                        fieldId: "custrecord_cmms_pbview_show_all_ww_tech",
                        value: showAll,
                    });
                    view.setValue({
                        fieldId: "custrecord_cmms_pbview_hide_start_end",
                        value: hideTime,
                    });
                    var viewId = view.save({
                        ignoreMandatoryFields: true,
                        enableSourcing: true,
                    });


                } catch (error) {
                    log.debug("Error in Planner Board setup", error)
                }
            }

            createView('Timeline','Timeline',1,true,75,false,true);
            createView('Timeline Week','Timeline Week',7,false,null,false,true);
            createView('Work Week','Timeline Work Week',5,false,125,false,false);
            createView('Month','Month',30,false,null,false,true);
            createView('All Tech','Workweek',5,false,null,true,true);

            function createColor(name, red, green, blue, isDefault, isBlocked) {
                log.debug("creating color")
                try {
                    var color = record.create({
                        type: 'customrecord_cmms_color',
                    })
                    color.setValue({
                        fieldId: "name",
                        value: name,
                    });
                    color.setValue({
                        fieldId: "custrecord_cmms_color_red",
                        value: red,
                    });
                    color.setValue({
                        fieldId: "custrecord_cmms_color_green",
                        value: green,
                    });
                    color.setValue({
                        fieldId: "custrecord_cmms_color_blue",
                        value: blue,
                    });
                    color.setValue({
                        fieldId: "custrecord_cmms_color_config",
                        value: systemSetupId,
                    });
                    color.setValue({
                        fieldId: "custrecord_cmms_color_isdefault",
                        value: isDefault,
                    });
                    color.setValue({
                        fieldId: "custrecord_cmms_color_is_bto_def",
                        value: isBlocked,
                    });
                    var colorId = color.save({
                        ignoreMandatoryFields: true,
                        enableSourcing: true,
                    });
                } catch (error) {
                    log.debug("Error in creating PB Color", error)
                }
            }
            createColor('Blocked Time', 107, 95, 95, false, true);
            createColor('Blue',83,113,151,true,false);
            createColor('Green',137,174,77,false,false);
            createColor('Light Blue',146,166,172,false,false);
            createColor('Light Purple',187,191,210,false,false);
            createColor('Orange',221,171,120,false,false);
            createColor('Purple',141,115,132,false,false);
            createColor('Red',175,107,94,false,false);
            createColor('Yellow',218,170,48,false,false);

            function createTechColor(name,color,order){
                try {
                    var techColor = record.create({
                        type: 'customrecord_cmms_technician_color',
                    });
                    techColor.setValue({
                        fieldId:'name',
                        value:name
                    })
                    techColor.setValue({
                        fieldId:'custrecord_cmms_tech_color_system_setup',
                        value:systemSetupId
                    })
                    techColor.setValue({
                        fieldId:'custrecord_cmms_tech_color_order',
                        value:order
                    })
                    techColor.setText({
                        fieldId:'custrecord_cmms_tech_color',
                        text:color
                    })
                    var techColorId = techColor.save({
                        ignoreMandatoryFields: true,
                        enableSourcing: true,
                    });

                } catch (error) {
                    log.debug("Error in creating Tech Color",error)
                }
            }
            createTechColor('1st Color - Blue','Blue',1);
            createTechColor('2nd - Green','Green',1);
            createTechColor('3rd - Light Blue','Light Blue',1);
            createTechColor('4th - Light Purple','Light Purple',1);
            createTechColor('5th - Orange','Orange',1);
            createTechColor('6th - Purple','Purple',1);
            createTechColor('7th - Red','Red',1);
            createTechColor('8th - Yellow','Yellow',1);

            function createColorMapping(csoField, fieldID, color, priority){
                var colorMapping = record.create({
                    type: 'customrecord_cmms_cso_color_mapping',
                })

                colorMapping.setText({
                    fieldId: 'custrecord_cmms_clr_map_cso_field',
                    text: csoField
                })
                colorMapping.setText({
                    fieldId: 'custrecord_cmms_clr_map_color_value',
                    text: color
                })
                colorMapping.setValue({
                    fieldId: 'custrecord_cmms_clr_map_cso_field_val',
                    value: fieldID
                })
                colorMapping.setValue({
                    fieldId: 'custrecord_cmms_clr_map_system_setup',
                    value: systemSetupId
                })
                colorMapping.setValue({
                    fieldId: 'custrecord_cmms_clr_map_priority',
                    value: priority
                })
                var colorMappingId = colorMapping.save({
                    ignoreMandatoryFields: true,
                    enableSourcing: true,
                });
            
            }
            createColorMapping('Workflow Status',2,'Blue',1);
            createColorMapping('Workflow Status',6,'Green',9);
            createColorMapping('Workflow Status',5,'Purple',8);
            createColorMapping('Workflow Status',13,'Purple',7);
            createColorMapping('Workflow Status',17,'Red',4);
            createColorMapping('Workflow Status',14,'Purple',5);
            createColorMapping('Workflow Status',8,'Red',3);
            createColorMapping('Workflow Status',7,'Red',2);
            createColorMapping('Workflow Status',15,'Purple',6);

            var pbMsg = messages["systemSetup"];
            pbMsg.push("Planner Board Views and Colors");
            messages["systemSetup"] = pbMsg;
        }

        // Summary Card -----------------------------------------------------------
        if(summaryCard && systemSetupId){
            function createSummary(csoField,fieldId,fieldType, order){
                try {
                    var soCardInfo = record.create({
                        type: 'customrecord_cmms_srvc_ordr_card_info',
                    })
                    soCardInfo.setText({
                        fieldId: 'name',
                        text: csoField
                    })
                    soCardInfo.setText({
                        fieldId: 'custrecord_cmms_cardinfo_type',
                        text: "CMMS Service Order"
                    })
                    soCardInfo.setText({
                        fieldId: 'custrecord_cmms_cardinfo_fieldscriptid',
                        text: fieldId
                    })
                    soCardInfo.setText({
                        fieldId: 'custrecord_cmms_cardinfo_field_type',
                        text: fieldType
                    })
                    soCardInfo.setValue({
                        fieldId: 'custrecord_cmms_cardinfo_type',
                        value: order
                    })
                    var soCardInfoId = soCardInfo.save({
                        ignoreMandatoryFields: true,
                    });
                } catch (error) {
                    log.debug("Error in Create Summary", error)
                }
                
            }
            createSummary("Equipment Type", 'CUSTRECORD_CMMS_EQSRV_EQUIPMENT_TYPE','List/Record', 1)
        }



        // Demo Records ----------------------------------------------------------
        if (demoEquip && serviceZone) {
            var equipType = currRecord.getValue("equiptype");
            var makemodel = currRecord.getValue("makemodel");

            if (equipType == "" || equipType == null) {
                equipType = "Demo Equipment Type";
            }
            if (makemodel == "" || makemodel == null) {
                makemodel = "Demo Make/Model";
            }

            var newEquipType = record.create({
                type: "customrecord_cmms_equipttype",
            });

            newEquipType.setValue({
                fieldId: "name",
                value: equipType,
            });

            var equipTypeId = newEquipType.save({
                ignoreMandatoryFields: true,
                enableSourcing: true,
            });

            var newMakeModel = record.create({
                type: "customrecord_cmms_makemodel",
            });

            newMakeModel.setValue({
                fieldId: "name",
                value: makemodel,
            });

            newMakeModel.setValue({
                fieldId: "custrecord_cmms_mkmdl_equipt_type",
                value: equipTypeId,
            });

            var makeModelId = newMakeModel.save({
                ignoreMandatoryFields: true,
                enableSourcing: true,
            });

            var newEquipment = record.create({
                type: "customrecord_cmms_equipt",
            });

            newEquipment.setValue({
                fieldId: "custrecord_cmms_equipt_equipttype",
                value: equipTypeId,
            });

            newEquipment.setValue({
                fieldId: "custrecord_cmms_equipt_makemodel",
                value: makeModelId,
            });

            newEquipment.setValue({
                fieldId: "custrecord_cmms_equipt_serialnumber",
                value: 12345,
            });

            newEquipment.setValue({
                fieldId: "custrecord_cmms_equipt_service_region",
                value: serviceZone,
            });

            newEquipment.setValue({
                fieldId: "name",
                value: makemodel + ":" + 12345,
            });

            var equipId = newEquipment.save({
                ignoreMandatoryFields: true,
                enableSourcing: true,
            });
            var recMsg = messages["records"];
            recMsg.push("Equipment Type: " + equipType);
            recMsg.push("Make/Model: " + makemodel);
            recMsg.push("Equipment: " + makemodel + ":" + 12345);
            messages["records"] = recMsg;
        }
        // Demo Records ITems ---------------------------------------------------
        if(demoItems){
            if(service != null && service != ''){
                try {
                    var serviceRec = record.create({
                        type: 'serviceitem',
                    })
    
                    serviceRec.setValue({
                        fieldId: "itemid",
                        value: service,
                    });
                    serviceRec.setValue({
                        fieldId: "custitem_cmms_enable_manual_ptm",
                        value: true,
                    });
                    serviceRec.setValue({
                        fieldId: "custitem_cmms_tech_signature_reqd",
                        value: true,
                    });
                    serviceRec.setText({
                        fieldId: "custitem_cmms_service_type",
                        text: "Regular Maintenance",
                    });
                    serviceRec.setText({
                        fieldId: "custitem_cmms_service_order_type",
                        text: "Reactive Maintenance",
                    });
                    serviceRec.setText({
                        fieldId: "custitem_cmms_labor_pricing_model",
                        text: "Hourly",
                    });
                    serviceRec.setText({
                        fieldId: "custitem_cmms_service_time_type",
                        text: "Labor",
                    });
                    var serviceId = serviceRec.save({
                        ignoreMandatoryFields: true,
                        enableSourcing: true,
                    });
                    var recMsg = messages["records"]
                    recMsg.push("Service Item: "+service);
                    messages["records"] = recMsg;
                } catch (error) {
                    log.debug("Error while creating Items", error)
                }
            }

            if(travel != null && travel != ''){
                try {
                    var serviceRec = record.create({
                        type: 'serviceitem',
                    })
    
                    serviceRec.setValue({
                        fieldId: "itemid",
                        value: travel,
                    });
                    serviceRec.setValue({
                        fieldId: "custitem_cmms_enable_manual_ptm",
                        value: true,
                    });

                    serviceRec.setText({
                        fieldId: "custitem_cmms_labor_pricing_model",
                        text: "Hourly",
                    });
                    serviceRec.setText({
                        fieldId: "custitem_cmms_service_time_type",
                        text: "Travel",
                    });
                    var travelId = serviceRec.save({
                        ignoreMandatoryFields: true,
                        enableSourcing: true,
                    });
                    if(systemSetupId){
                        record.submitFields({
                            type: 'customrecord_cmms_config',
                            id: systemSetupId,
                            values: {"custrecord_cmms_travel_time_service_item": travelId}
                            
                        })
                    }
                    var recMsg = messages["records"]
                    recMsg.push("Travel Item: "+travel);
                    messages["records"] = recMsg;
                } catch (error) {
                    log.debug("Error while creating Items", error)
                }
            }
        }
        // Tech Setup ------------------------------------------------------------
        var employees = currRecord.getValue("employee");
        if (employees.length > 0 && employees[0] != '') {
            log.debug("Employees", employees)
            try {
                var isTech = currRecord.getValue("istech");
                var isManager = currRecord.getValue("ismanager");
                var bins = currRecord.getValue("bins");
                var location = currRecord.getValue("locations");
                var primaryServiceZone = currRecord.getValue("primaryservicezone");
                var password = currRecord.getValue("password");
                var binTypes = [
                    "Technician Cache",
                    "Technician Pending Accept Cache",
                    "Returned Items",
                ];
                var binCodes = ["I", "P", "R"];
                var values = {};
                if (isTech) {
                    values["custentity_cmms_is_technician"] = true;
                }
                if (isManager) {
                    values["custentity_cmms_is_service_manager"] = true;
                }
                if (setServiceZone && primaryServiceZone) {
                    values["custentity_cmms_service_regions"] = primaryServiceZone;
                }
                if (password) {
                    values["custentity_cmms_app_password"] = password;
                }
                for (var index = 0; index < employees.length; index++) {
                    var employeeId = parseInt(employees[index]);
                    var empRec = record.load({
                        type: "employee",
                        id: employeeId,
                    });
                    var empFirstName = empRec.getValue("firstname");
                    var empLastName = empRec.getValue("lastname");
                    var empPartsBin = empRec.getValue("custentity_cmms_tech_parts_bin");
                    if (bins) {
                        if (location) {
                            record.submitFields({
                                type: "location",
                                id: location,
                                values: { usebins: true },
                            });
                            if(empPartsBin == null || empPartsBin == ''){
                                for (var index = 0; index < binTypes.length; index++) {
                                    var type = binTypes[index];
                                    var bin = record.create({
                                        type: "bin",
                                    });
                                    bin.setValue({
                                        fieldId: "location",
                                        value: location,
                                        ignoreFieldChange: false,
                                    });
                                    bin.setText({
                                        fieldId: "custrecord_cmms_field_parts_bin_type",
                                        text: type,
                                    });
                                    if(empLastName != null && empLastName != ''){
                                        var binName = empLastName + empFirstName[0] + " " + binCodes[index];
                                    } else {
                                        var binName = empFirstName + " " + binCodes[index];
                                    }
                                    
                                        
                                    bin.setValue({
                                        fieldId: "binnumber",
                                        value: binName,
                                    });
                                    var binId = bin.save({
                                        enableSourcing: true,
                                        ignoreMandatoryFields: true,
                                    });
                                    var binMsg = messages["bins"];
                                    binMsg.push(binName);
                                    messages["bins"] = binMsg;
                                    if (index == 0) {
                                        record.submitFields({
                                            type: "employee",
                                            id: employeeId,
                                            values: { custentity_cmms_tech_parts_bin: binId },
                                        });
                                    }
                                    if (index == 1) {
                                        record.submitFields({
                                            type: "employee",
                                            id: employeeId,
                                            values: { custentity_cmms_xfer_to_tech_parts_bin: binId },
                                        });
                                    }
                                    if (index == 2) {
                                        record.submitFields({
                                            type: "employee",
                                            id: employeeId,
                                            values: { custentity_cmms_tech_ret_parts_bin: binId },
                                        });
                                    }
                                }
                            }
                        }
                    }
                    record.submitFields({
                        type: "employee",
                        id: employeeId,
                        values: values,
                    });
                    empMsg = messages["employees"]
                    empMsg.push(empFirstName+" "+empLastName)
                    messages["employees"] = empMsg;
                }
            } catch (error) {
                log.debug("Error in Tech Setup", error);
            }
        }

        // Rental ----------------------------------------------------------------
        var usesRental = currRecord.getValue("usesrental");
        if (usesRental) {
            enableFeature("Rental");
            setFieldValue("custrecord_cmms_create_rent_from_so_head", true);
            setFieldValue("custrecord_cmms_rc_create_wo_equpit", true);
            setFieldValue("custrecord_cmms_allow_rc_wo_end_date", true);
        }

        function success(result) { }
        function failure(reason) {
            console.log("Failure: " + reason);
        }

        message = "<b>Setup is Complete.</b>";

        if (messages["systemSetup"].length > 0) {
            message = message + '<div style="color:black; margin-top: 6px; background-color:#A195F7; border-color:blue; border-style:solid; border-width:thin; padding:10px; border-radius:10px;">';
            message = message + "<b>Set the following:</b>";
            for (var index = 0; index < messages["systemSetup"].length; index++) {
                var text = messages["systemSetup"][index];

                message = message + "<br>• " + text;
            }
            message = message + "</div>";
        }
        if (messages["records"].length > 0) {
            message = message + '<div style="color:black; margin-top: 6px; background-color:#a7e3a6; border-color:green; border-style:solid; border-width:thin; padding:10px; border-radius:10px;">';
            message = message + "<b>Created the following records:</b>";
            for (var index = 0; index < messages["records"].length; index++) {
                var text = messages["records"][index];

                message = message + "<br>• " + text;
            }
            message = message + "</div>";
        }
        if (messages["employees"].length > 0) {
            message = message + '<div style="color:black; margin-top: 6px; background-color:#95BAF7; border-color:green; border-style:solid; border-width:thin; padding:10px; border-radius:10px;">';
            message = message + "<b>Updated the following employees:</b>";
            for (var index = 0; index < messages["employees"].length; index++) {
                var text = messages["employees"][index];

                message = message + "<br>• " + text;
            }
            message = message + "</div>";
        }
        if (messages["bins"].length > 0) {
            message = message + '<div style="color:black; margin-top: 6px; background-color:#EBBA4A; border-color:prange; border-style:solid; border-width:thin; padding:10px; border-radius:10px;">';
            message = message + "<b>Created the following bins:</b>";
            for (var index = 0; index < messages["bins"].length; index++) {
                var text = messages["bins"][index];

                message = message + "<br>• " + text;
            }
            message = message + "</div>";
        }

        if (!failed) {
            dialog.alert({
                title: "System Setup has been changed.",
                message: message,
            })
                .then(success)
                .catch(failure);
        }
    }
    return {
        pageInit: pageInit,
        processForm: processForm,
    };
});
