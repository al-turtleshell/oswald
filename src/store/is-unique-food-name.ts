import prisma from "../../prisma/prisma";


async function isUniqueFoodName(name: string): Promise<boolean> {
    
    const result = await prisma.eventStore.findFirst({
        where: {
            payload: {
                path: ["name"],
                equals: name
            }
        }
    })

    return !result;
}

export { isUniqueFoodName };