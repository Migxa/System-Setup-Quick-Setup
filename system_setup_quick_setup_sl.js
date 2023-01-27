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

        

         var webAppField = form.addField({
            id:"webappversion",
            type:serverWidget.FieldType.SELECT,
            label: "Web App Version",
            source: 'customlist_cmms_web_app_version',
            container: 'systemSetupContainer'
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

        plannerboard.setHelpText("Sets default Views, Technician Filters, Tile Fields, Tile Colors, and Filed Color Mappings.")

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

        

        var serviceZone = form.addField({
            id:"servicezone",
            type: serverWidget.FieldType.SELECT,
            label: "Service Zone",
            container: 'demorecords',
            source: 'customrecord_cmms_service_region'
        })

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
            help: "This will create a 'Repair' and 'Travel' service items."
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
            help: "Select employees that you would like to turn into technicians or service manager (or both).",
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

        var primaryServiceZone = form.addField({
            id:"primaryservicezone",
            type: serverWidget.FieldType.MULTISELECT,
            label: "Primary Service Zone",
            container: 'techcontainer',
            source: 'customrecord_cmms_service_region'
        })

        

        primaryServiceZone.setHelpText({
            help: "Select Service Zones that will be selected as primary on the technicians."
        })

        var password = form.addField({
            id:"password",
            type: serverWidget.FieldType.TEXT,
            label: 'Set Password',
            container: 'techcontainer',
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