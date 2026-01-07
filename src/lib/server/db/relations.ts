import { relations } from "drizzle-orm/relations";
import { user, session, account, bankLoad, matchedModelOutput, testBankLoad, testMatchedOutput } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const matchedModelOutputRelations = relations(matchedModelOutput, ({one}) => ({
	bankLoad: one(bankLoad, {
		fields: [matchedModelOutput.bankLoadId],
		references: [bankLoad.id]
	}),
}));

export const bankLoadRelations = relations(bankLoad, ({many}) => ({
	matchedModelOutputs: many(matchedModelOutput),
}));

export const testMatchedOutputRelations = relations(testMatchedOutput, ({one}) => ({
	testBankLoad: one(testBankLoad, {
		fields: [testMatchedOutput.testBankLoadId],
		references: [testBankLoad.id]
	}),
}));

export const testBankLoadRelations = relations(testBankLoad, ({many}) => ({
	testMatchedOutputs: many(testMatchedOutput),
}));