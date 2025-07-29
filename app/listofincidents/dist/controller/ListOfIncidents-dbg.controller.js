sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], (Controller, Filter, FilterOperator, Fragment, JSONModel, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("mi.listofincidents.controller.ListOfIncidents", {
        onInit() {
			var oViewModel = new JSONModel({
				filterEnabled: false,
				createDiaog: {
					title: "",
					description: "",
					quantity: 0
				}
			});

            this.getView().setModel(oViewModel, "viewModel");
        },

        onSearchTitle: function (oEvent) {
            var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("Title", FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oList = this.byId("idIncidentsTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
        },

        onSearchCustomer: function (oEvent) {
            var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("Customer_ID", FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oList = this.byId("idIncidentsTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
        },

		onFilterTableByQuantityPress: function () {
			if (!this.oFilterItemsDialog) {
				Fragment.load({
					id: this.getView().getId(),
					name: "mi.listofincidents.view.FilterByQuantity",
					controller: this
				}).then(oDialog => {
					this.oFilterItemsDialog = oDialog;
					this.getView().addDependent(oDialog);
					oDialog.open();
				})
			} else {
				this.oFilterItemsDialog.open();
			}
        },

		onCreateItemPress: function () {
			if (!this.oCreateItemFragment) {
				this.oCreateItemFragment = Fragment.load({
					name: "mi.listofincidents.view.CreateItem",
					controller: this
				});
				this.oCreateItemFragment.then(function (oDialog) {
					this.oCreateItemDialog = oDialog;
					this.oCreateItemDialog.setModel(new JSONModel({}), "createItemDialog");
					this.getView().addDependent(this.oCreateItemDialog);
				}.bind(this))
			}
			this.oCreateItemFragment.then(function (oDialog) {
				var oCreateItemDialogModel = oDialog.getModel("createItemDialog");
				var oCreateItemDialogModelData = {
					title: "",
					description: "",
					quantity: 0
				};
				oCreateItemDialogModel.setData(oCreateItemDialogModelData);
				oDialog.open();
			}.bind(this));
        },

		closeCreateDialog: function () {
			this.getView().setBusy(false);
			this.oCreateItemDialog.close();
		},

		closeFilterDialog: function () {
			this.oFilterItemsDialog.close();
		},

		onFilterItemsByQuantity: function () {
			this.getView().byId("idFilterByQuantityDialog").getObjectBinding().invoke();
		},

		onCreateItemByQuantity: function () {
			var oCreateItemDialogModel = this.oCreateItemDialog.getModel("createItemDialog");
			var ooCreateItemDialogModelData = oCreateItemDialogModel.getData();
			var sTitleValue = ooCreateItemDialogModelData.title,
				sDescriptionValue = ooCreateItemDialogModelData.description,
				iQuantityValue = Number(ooCreateItemDialogModelData.quantity);

			var oModel = this.getView().getModel();
			var oContext = this.getView().getBindingContext();
			var oAction = oModel.bindContext("/ProcessorService.createItem(...)");

			oAction.setParameter("title", sTitleValue);
			oAction.setParameter("description", sDescriptionValue);
			oAction.setParameter("quantity", iQuantityValue);

			this.getView().setBusy(true);
			
			oAction.execute()
			.then(function () {
				this.getView().setBusy(false);
				this.closeCreateDialog();
				this.getView().getModel().refresh()
			}.bind(this))
			.catch(function (oError) {
				this.getView().setBusy(false);
				this.closeCreateDialog();
				MessageBox.error(oError.message);
			}.bind(this));
		}
    });
});