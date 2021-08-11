import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to create a new user", async () => {
        const user: ICreateUserDTO = {
            name: "Ronaldo Nazário",
            email: "email",
            password: "1"
        };

        const result = await createUserUseCase.execute(user)

        expect(result).toEqual(
            expect.objectContaining({
                id: result.id,
                name: result.name,
                email: result.email
            })
        );
    });

    it("should not be able to create a user when the email already exists", async () => {

        const user1 = {
            name: "name",
            email: "email",
            password: "1"
        };

        await createUserUseCase.execute(user1)

        await expect(
            createUserUseCase.execute(user1)
        ).rejects.toEqual(new CreateUserError());
    });

});
