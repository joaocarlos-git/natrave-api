import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

export const create = async ctx => {   
    if(ctx.headers.authorization){
        ctx.status = 401
        return
    } 

   const[type, token] = ctx.headers.authorization.split("")
   consolog.log({type, token})

   try {
            const data = jwt.verify(token, process.env.JWT_SECRET)  
                
            if(!ctx.request.body.homeTeamScore && !ctx.request.body.awaitTeamScore){
                ctx.status = 400
                return
            }
            const userId = '049572934579057905729579'
            const{ gameId} = ctx.request.body
            const homeTeamScore = parseInt(ctx.request.body.homeTeamScore)
            const awaitTeamScore = parseInt(ctx.request.body.awaitTeamScore)


            try {        
        
            const [hunch] = await prisma.hunch.findMany({
                where: {userId, gameId},
            })
                ctx.body = hunch
                    ? await prisma.hunch.update({
                        where: {
                            id: hunch.id
                        }, 
                        data: {
                            homeTeamScore,
                            awaitTeamScore
                        }

                    })
                    : await prisma.hunch.create({
                        data:{
                            userId,
                            gameId,
                            homeTeamScore,
                            awaitTeamScore
                        }
                    })            
            
        } catch (error) {
            console.log(error)
            ctx.body = error
            ctx.status = 500
        }
    }catch (error) {
        ctx.status = 401
        return
      
    }
}

