import { BaseEntityModel as IBaseEntityModel } from './base-entity.model';
import { Organization } from './organization.model';
import { OrganizationClients } from './organization-clients.model';
import { InvoiceItem } from './invoice-item.model';

export interface Invoice extends IBaseEntityModel {
	invoiceDate: Date;
	invoiceNumber: number;
	dueDate: Date;
	currency: string;
	discountValue: number;
	paid: boolean;
	tax: number;
	terms: string;
	totalValue?: number;
	clientId?: string;
	organizationId?: string;
	fromOrganization?: Organization;
	toClient?: OrganizationClients;
	invoiceItems?: InvoiceItem[];
	invoiceType?: string;
}

export enum DiscountTypeEnum {
	PERCENTAGE = 'Percentage',
	VALUE = 'Value'
}
