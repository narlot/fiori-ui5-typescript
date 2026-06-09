import Controller from "sap/ui/core/mvc/Controller";
import { Attributes, Value } from "../data/Attributes";
import JSONModel from "sap/ui/model/json/JSONModel";
import { TAttribute } from "../type";
import View from "sap/ui/core/mvc/View";
import Event from "sap/ui/base/Event";
import ComboBox from "sap/m/ComboBox";
import ListItem from "sap/ui/core/ListItem";
import ColumnListItem from "sap/m/ColumnListItem";

/**
 * @namespace ui.ruleengine.controller
 */
export default class Main extends Controller {

    public onInit(): void {
        this._init();
    }

    private _init(): void {
        const attributes: TAttribute[] = Attributes;
        const value: TAttribute[] = Value;

        const childrenModel: JSONModel = new JSONModel();
        childrenModel.setData(attributes);
        const childrenValueModel: JSONModel = new JSONModel();
        childrenValueModel.setData(value);
        const childrenValueModelBackUp: JSONModel = new JSONModel();
        childrenValueModelBackUp.setData(value);

        const parentModel: JSONModel = new JSONModel();
        parentModel.setData(attributes);
        const parentValueModel: JSONModel = new JSONModel();
        parentValueModel.setData(value);
        const parentValueModelBackUp: JSONModel = new JSONModel();
        parentValueModelBackUp.setData(value);

        const view = this.getView() as View;

        view.setModel(childrenModel, "children");
        view.setModel(childrenValueModel, "childrenValue");
        view.setModel(childrenValueModelBackUp, "childrenValueBackUp");

        view.setModel(parentModel, "parent");
        view.setModel(parentValueModel, "parentValue");
        view.setModel(parentValueModelBackUp, "parentValueBackUp");

    }

    onAttributeChange(oEvent: Event): void {
        const comboBox = oEvent.getSource() as ComboBox;
        const selectedKey = comboBox.getSelectedKey();

        const view = this.getView() as View;

        const childrenValueModel = view.getModel("childrenValue") as JSONModel;
        const childrenValueModelBackUp = view.getModel("childrenValueBackUp") as JSONModel;
        const childrenValueModelBackUpBData: TAttribute[] = childrenValueModelBackUp.getData() || [];
        childrenValueModel.setData(childrenValueModelBackUpBData);

        const childrenValueSet: TAttribute[] = childrenValueModel.getData() || [];
        const childrenValues = childrenValueSet.filter((item: TAttribute) => item.key === selectedKey);
        childrenValueModel.setData(childrenValues);
        view.setModel(childrenValueModel, "childrenValue");
    }

    onRowSelectionChange(oEvent: Event): void {
        interface SelectionChangeParams {
            listItem: ColumnListItem;
            selected: boolean;
        }

        const { listItem, selected } = oEvent.getParameters() as SelectionChangeParams;
        const listItemData: TAttribute = listItem.getBindingContext("parent")?.getObject() as TAttribute;
        console.log(listItemData);

        const view = this.getView() as View;

        const parentValueModel = view.getModel("parentValue") as JSONModel;
        const parentValueModelBackUp = view.getModel("parentValueBackUp") as JSONModel;
        parentValueModel.setData(parentValueModelBackUp.getData() || []);

        const parentValueModelData = parentValueModel.getData() || [];

        const result = parentValueModelData.filter((item: TAttribute) => item.key === listItemData.key);
        parentValueModel.setData(result);

    }
}