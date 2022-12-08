# Solidity TS Hardhat project template

This is sceleton for using in production, including development, audit and testing of contracts on Solidity with Hardhat, Ethers and TypeScript.

Note 1. This project template is ready for use, only README.md files are not ready, they are in the process. In the future, this template can be improved and supplemented.

Note 2. In GitHub it can be reused by clicking the "Use this template" button at the top of the page.

The MIT license is used, if otherwise, replace the `LICENSE` file and the "license" field in the `package.json` file according to your needs.

The project name, description and author can be set in the `package.json` file.

Note 3. There are a lot of comments in the files `.env.example` and `hardhat.config.ts`.

Банковские ячейки (Signatures)
Написать контракт, в котором пользователи могут создавать свои банковские ячейки, в которых они могут хранить ERC20 токены, Эфир или НФТ.
При этом один пользователь может создать неограниченное количество ячеек.
Вывести средства из определенной ячейки пользователя может любой пользователь, который предоставит сообщение, подписанное этим пользователем. Сообщение должно хранить в себе ID ячейки,
адрес того кто может вывести средства из ячейки и deadline, после которого данная подпись является недействительной. При этом надо учесть, чтобы из одной ячейки можно было вывести средства только один раз.
Для реализации использователь базовый Hardhat репозиторий и ветку signature, ECDSA библиотеку от OpenZeppelin, написать тест на JSдемонстрирующие работу контракта.
