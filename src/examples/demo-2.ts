import mcrx from "../index"

const startDemo = (rootDir: string) => {
    console.log(`[MCRX/demo-2] starting demo for: ${rootDir}`)

    const {
        files$,
        //logs$,
        loggedEvents$,
        playerEvents$,
        chatEvents$
    } = mcrx(rootDir)

    const {playerJoined$, playerLeft$} = playerEvents$
    const {messageSent$} = chatEvents$

    //logs$.subscribe(v => console.error(`([${v.timestamp}] ${v.content}`))
    loggedEvents$.stream$.subscribe(v => v.type !== 'raw' ? console.warn(`E -> [${v.line.timestamp}] {${v.type}} ${JSON.stringify(v.data)}`) : undefined)
    playerJoined$.subscribe(v => console.info(`J -> [${v.timestamp}] player joined: ${v.player.name}`))
    playerLeft$.subscribe(v => console.info(`L -> [${v.timestamp}] player left: ${v.player.name}`))
    messageSent$.subscribe(v => console.info(`C -> [${v.timestamp}] ${v.message.author} sent: '${v.message.content}'`))

    //loggedEvents$.stream$.subscribe(v => console.dir(v))

    console.info(`[MCRX/demo-2] bootstrapped for ${files$.cwd}`)
}

export default startDemo(process.argv[2])