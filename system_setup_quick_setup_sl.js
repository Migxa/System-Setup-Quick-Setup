/**
 *@NApiVersion 2.x
 *@NModuleScope Public
 *@NScriptType Suitelet
 */
 define(['N/log', 'N/ui/serverWidget', 'N/record', 'N/search', 'N/http'],
 function(log, serverWidget, record, search, http) {

     function onRequest(context) {
         var form = serverWidget.createForm({
             title: "CMMS System Setup Quick Setup"
         })
         form.clientScriptModulePath = 'SuiteScripts/system_setup_quick_setup_cli.js';

         var systemSetupContainer = form.addFieldGroup({
            id: "systemSetupContainer",
            label: "System Setup"
         })

         var initialSetup = form.addField({
            id:"initialsetup",
            type: serverWidget.FieldType.CHECKBOX,
            label: "Initial Mandatory Fields Setup",
            container: 'systemSetupContainer'
        })

        initialSetup.setHelpText({
            help: "If checked, the script will configure all mandatory fields in the System Setup. It will also populate the fields that are almost always set up after the bundle install like Optional Mobile Tasks."
        })

         var systemSetupField = form.addField({
            id:"systemsetuprecord",
            type:serverWidget.FieldType.SELECT,
            label: "System Setup Record",
            source: 'customrecord_cmms_config',
            container: 'systemSetupContainer'
         })

         systemSetupField.updateBreakType({
            breakType : serverWidget.FieldBreakType.STARTCOL
        }); 

        systemSetupField.setHelpText({
            help: "Select the ID of the System Setup record. You only need to populate this field if you are making changes to the System Setup record like 'Initial Mandatory Fields Setup', 'Rental Setup', 'Planner Board Views and Colors', etc. Creating demo records or modifying employee records doesn't require this field to be popualted, but it can't hurt to select the System Setup every single time just in case."
        })


         var webAppField = form.addField({
            id:"webappversion",
            type:serverWidget.FieldType.TEXT,
            label: "Web App Version",
            container: 'systemSetupContainer'
         })

         webAppField.setHelpText({
            help: "Write the Web App version (v1, v2, v3...). Populate this field if you want to set the Web App version in the SO Pipeline subtab of the System Setup. Note that 'Initial Mandatory Fields Setup' must be checked, for the Web App version to be updated."
        })

         var plannerboard = form.addField({
            id:"plannerboard",
            type: serverWidget.FieldType.CHECKBOX,
            label: "Planner Board Views and Colors",
            container: 'systemSetupContainer'
        })

        plannerboard.updateBreakType({
            breakType : serverWidget.FieldBreakType.STARTCOL
        }); 

        plannerboard.setHelpText("Sets Views, Technician Colors, Tile Colors, and Field Color Mappings.")

        // var summaryCard = form.addField({
        //     id:"summarycard",
        //     type: serverWidget.FieldType.CHECKBOX,
        //     label: "Summary Card Fields",
        //     container: 'systemSetupContainer'
        // })
        

        // Demo Equipment ----------------------------------------------------------

        var demoRecordsContainer = form.addFieldGroup({
            id:"demorecords",
            label: "Demo Records"
        })

        var demoEquip = form.addField({
            id:"demoequip",
            type: serverWidget.FieldType.CHECKBOX,
            label: "Create Demo Equipment",
            container: 'demorecords'
        })

        demoEquip.setHelpText("Check this field if you want the script to create a demo Equipment. The script will use the values in the 'Service Zone', 'Demo Equipment Type Name', and 'Demo Make/Model Name' to create the Equipment Type, Make/Model and the Equipment itself.")
        

        var serviceZone = form.addField({
            id:"servicezone",
            type: serverWidget.FieldType.SELECT,
            label: "Service Zone",
            container: 'demorecords',
            source: 'customrecord_cmms_service_region'
        })

        serviceZone.setHelpText("Select exsting Service Zone or create a new one that the Equipment will be assigned to.")

        serviceZone.updateBreakType({
            breakType : serverWidget.FieldBreakType.STARTCOL
        }); 

        var equiptype = form.addField({
            id:"equiptype",
            type: serverWidget.FieldType.TEXT,
            label: "Demo Equipment Type Name",
            container: 'demorecords'
        })

        equiptype.defaultValue = 'Pickup Truck'

        var makemodel = form.addField({
            id:"makemodel",
            type: serverWidget.FieldType.TEXT,
            label: "Demo Make/Model Name",
            container: 'demorecords'
        })

        makemodel.defaultValue = "Ford F-150"

        var demoItems = form.addField({
            id:"demoitems",
            type: serverWidget.FieldType.CHECKBOX,
            label: "Create Demo Service Items",
            container: 'demorecords'
        })

        demoItems.setHelpText({
            help: "This will create a 'Repair' and 'Travel' service items. If either field is empty, then the script will not create a Service item of that type. If you don't want to create a Travel service item, then make the 'Demo Travel Item Name' field blank."
        })

        demoItems.updateBreakType({
            breakType : serverWidget.FieldBreakType.STARTCOL
        }); 

        var service = form.addField({
            id:"service",
            type: serverWidget.FieldType.TEXT,
            label: "Demo Service Item Name",
            container: 'demorecords'
        })

        service.setHelpText("If 'Create Demo Service Items' is checked and this field is not blank, the script will create a new Service item with this name.")

        service.updateBreakType({
            breakType : serverWidget.FieldBreakType.STARTCOL
        }); 

        service.defaultValue = 'Repair'

        var travel = form.addField({
            id:"travel",
            type: serverWidget.FieldType.TEXT,
            label: "Demo Travel Item Name",
            container: 'demorecords'
        })

        travel.setHelpText("If 'Create Demo Service Items' is checked and this field is not blank, the script will create a new Travel item with this name. If 'System Setup Record' is provided, the script will also set the newly created Travel item as the default Travel item in the System Setup.")

        travel.defaultValue = "Travel"
        // Tech Setup ----------------------------------------------------------

        var techContainer = form.addFieldGroup({
            id:"techcontainer",
            label: "Technician Setup"
        })


        var employee = form.addField({
            id:"employee",
            type: serverWidget.FieldType.MULTISELECT,
            label: "Employee",
            container: 'techcontainer',
            source: 'employee'
        })

        employee.setHelpText({
            help: "Select employees that you would like to update.",
        })

        

        var isTech = form.addField({
            id:"istech",
            type: serverWidget.FieldType.CHECKBOX,
            label: 'Set "Is Technician"',
            container: 'techcontainer',
        })

        isTech.updateBreakType({
            breakType : serverWidget.FieldBreakType.STARTCOL
        }); 

    
        isTech.setHelpText({
            help: "This will set 'Is Technician' for the selected employees.",
        })

        var isManager = form.addField({
            id:"ismanager",
            type: serverWidget.FieldType.CHECKBOX,
            label: 'Set "Is Service Manager"',
            container: 'techcontainer',
        })

        isManager.setHelpText({
            help: "This will set 'Is Manager' for the selected employees.",
        })

        var setServiceZone = form.addField({
            id:"setservicezone",
            type: serverWidget.FieldType.CHECKBOX,
            label: 'Update Service Zone',
            container: 'techcontainer',
        })

        setServiceZone.setHelpText({
            help: "If checked, the script will take whatever is selected in the 'Primary Service Zone' field and update the selected employees with the following Service Zones. If this field is checked, but the Service Zone selection is empty, then the employees will be updated to have no Service Zones selected.",
        })

        var primaryServiceZone = form.addField({
            id:"primaryservicezone",
            type: serverWidget.FieldType.MULTISELECT,
            label: "Primary Service Zone",
            container: 'techcontainer',
            source: 'customrecord_cmms_service_region'
        })

        

        primaryServiceZone.setHelpText({
            help: "If 'Update Service Zone' is checked, the selected Service Zones will be selected as Primary Service Region on the technicians."
        })

        var password = form.addField({
            id:"password",
            type: serverWidget.FieldType.TEXT,
            label: 'Set Password',
            container: 'techcontainer',
        })

        password.setHelpText({
            help: "If a value is provided, then the script will update the Web App password for the selected employees.",
        })

        var bins = form.addField({
            id:"bins",
            type: serverWidget.FieldType.CHECKBOX,
            label: 'Create Bins',
            container: 'techcontainer',
        })

        bins.updateBreakType({
            breakType : serverWidget.FieldBreakType.STARTCOL
        }); 

        bins.setHelpText({
            help: "Will create 3 bins for the selected Employee and assign them. If the employee name is too long and doesn't fit into the bin name, the internal ID of the employee is used instead."
        })

        var location = form.addField({
            id:"locations",
            type: serverWidget.FieldType.SELECT,
            label: 'Bin Location',
            container: 'techcontainer',
            source: 'location'
        })

        location.updateBreakType({
            breakType : serverWidget.FieldBreakType.STARTCOL
        }); 

        location.setHelpText({
            help: "Choose the location that the bins should be created for.",
        })


        // Rental ---------------------------------------------

         var rentalContainer = form.addFieldGroup({
             id:"rentalContainer",
             label: "Rental"
         })

         var usesRental = form.addField({
             id:"usesrental",
             type: serverWidget.FieldType.CHECKBOX,
             label: "Initial Rental Setup",
             container: 'rentalContainer'
         })

         usesRental.setHelpText({
            help: "Turns on the Rental feature and does basic rental setup that is needed for the Rental features to work.",
        })

         var submitButton = form.addButton({
             label: "Submit",
             id: 'buttonid',
             functionName: 'processForm',
             container: 'fieldContainer'
         })

         context.response.writePage(form);
     }

     return {
         onRequest: onRequest
     };
 });