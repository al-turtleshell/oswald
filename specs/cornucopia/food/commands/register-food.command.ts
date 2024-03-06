import { Command } from "../../../../src/command";
import { v4 as uuid} from 'uuid';
import type { Event } from "../../../../src/event/event";
import { FoodRegistered } from "../events/food-registered.event";
import { CommandValidationError } from "../../../../src/error/CommandValidationError";
import { isUniqueFoodName } from "../../../../src/store/is-unique-food-name";

class RegisterFood extends Command {

    private _isUniqueFoodName: (foodName: string) => Promise<boolean> = isUniqueFoodName;

    constructor(public readonly foodName: string, public readonly type: string, _isUniqueFoodName?: (foodName: string) => Promise<boolean>) {        
        super();
        this._isUniqueFoodName = _isUniqueFoodName || isUniqueFoodName;
    };

    async execute(): Promise<Event> {
        const foodId = uuid();

        return new FoodRegistered(foodId, this.foodName, this.type);
    }

    protected async constraints(): Promise<void> {
        const isUnique = await this._isUniqueFoodName(this.foodName);
        
        if (!isUnique) {
            throw new CommandValidationError(this.constructor.name, 'Food name must be unique');
        }
    }
}

export { RegisterFood };