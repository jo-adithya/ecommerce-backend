import { FilterQuery, FlattenMaps, Model, ProjectionFields, UpdateQuery } from "mongoose";

import { Logger, NotFoundException } from "@nestjs/common";

export abstract class AbstractRepository<T> {
	protected abstract readonly logger: Logger;
	constructor(protected readonly model: Model<T>) {}

	async create(document: Omit<T, "_id">): Promise<FlattenMaps<T>> {
		this.logger.debug(`Creating ${this.model.modelName}: ${JSON.stringify(document)}`);
		const createdDocument = new this.model(document);
		return (await createdDocument.save()).toJSON();
	}

	async findOne(
		filterQuery: FilterQuery<T>,
		projection: ProjectionFields<T> = {},
	): Promise<FlattenMaps<T>> {
		this.logger.debug(`Finding one ${this.model.modelName}: ${JSON.stringify(filterQuery)}`);
		const document = await this.model.findOne(filterQuery).select(projection).lean().exec();
		this.assertDocumentExists(document, filterQuery);
		return document;
	}

	async findOneAndUpdate(
		filterQuery: FilterQuery<T>,
		updateQuery: UpdateQuery<T>,
		projection: ProjectionFields<T> = {},
	) {
		this.logger.debug(
			`Finding one and updating ${this.model.modelName}: ${JSON.stringify(filterQuery)}`,
		);
		const document = await this.model
			.findOneAndUpdate(filterQuery, updateQuery, { new: true })
			.select(projection)
			.lean()
			.exec();
		this.assertDocumentExists(document, filterQuery);
		return document;
	}

	async find(
		filterQuery: FilterQuery<T>,
		projection: ProjectionFields<T> = {},
	): Promise<FlattenMaps<T>[]> {
		this.logger.debug(`Finding all ${this.model.modelName}s: ${JSON.stringify(filterQuery)}`);
		return this.model.find(filterQuery).select(projection).lean().exec();
	}

	async findOneAndDelete(
		filterQuery: FilterQuery<T>,
		projection: ProjectionFields<T> = {},
	): Promise<FlattenMaps<T>> {
		this.logger.debug(
			`Finding one and deleting ${this.model.modelName}: ${JSON.stringify(filterQuery)}`,
		);
		const document = await this.model
			.findOneAndDelete(filterQuery)
			.select(projection)
			.lean()
			.exec();
		this.assertDocumentExists(document, filterQuery);
		return document;
	}

	private assertDocumentExists(
		document: FlattenMaps<T> | null,
		filterQuery: FilterQuery<T>,
	): asserts document is FlattenMaps<T> {
		if (!document) {
			this.logger.error(`Document not found for filter query: ${JSON.stringify(filterQuery)}`);
			throw new NotFoundException("Document not found");
		}
	}
}
