import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserCase: AuthenticateUserUseCase;

describe("User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    });

    it("Should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            name: "name",
            email: "email",
            password: "1"
        };

        await createUserUseCase.execute(user)

        const result = await authenticateUserCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(result).toEqual(
            expect.objectContaining({
                token: result.token,
                user: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email
                }
            })
        );
    });

    it("Should not be able to authenticate an nonexistent user", async () => {
        await expect(
            authenticateUserCase.execute({
                email: "no",
                password: "no",
            })
        ).rejects.toEqual(new IncorrectEmailOrPasswordError());
    });

    it("Should not be able to authenticate an incorrect password", async () => {
        const user: ICreateUserDTO = {
            name: "name",
            email: "email",
            password: ""
        };

        await createUserUseCase.execute(user)

        await expect(
            authenticateUserCase.execute({
                email: user.email,
                password: "anything",
            })
        ).rejects.toEqual(new IncorrectEmailOrPasswordError());
    });

});
