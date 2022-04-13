<script>
    import { onMount } from 'svelte';
    import { contract, channels, currentChannel, messages } from './consts.js';

    const getChannels = async () => {
        const txn = await $contract.getChannels();
        
        let channelsClean = [];

        txn.map(ch => {
            channelsClean.push({
                id: ch.id,
                name: ch.name,
                author: ch.author,
                timestamp: new Date(ch.timestamp * 1000).toLocaleString(),
                content: ch.content
            })
        })
        $channels = channelsClean;

        if ($channels.filter(id => id == $currentChannel).length === 0) {
            if($channels.length === 0) {
                $currentChannel = null;
            } else {
                $currentChannel = $channels[0].id;
            }
        }
        
        getMessages();
    }

    const getMessages = async () => {
        if ($channels.length === 0) {
            $messages = [];
            $currentChannel = 0;
            return;
        }
        const txn = await $contract.getMessages($currentChannel);
        let messagesClean = [];
        txn.map(msg => {
            messagesClean.push({
                id: msg.id,
                author: msg.author,
                timestamp: new Date(msg.timestamp * 1000).toLocaleString(),
                content: msg.content
            })
        })
        $messages = messagesClean;
    }

    const createChannel = async () => {
        let txn = await $contract.createChannel(newChName);
        newChName = "";
        await txn.wait();

        getChannels();

    }

    const deleteChannel = async (chId) => {
        let txn = await $contract.deleteChannel(chId);
        await txn.wait();
        getChannels();
    }

    const changeChannel = (chId) => {
        $currentChannel = chId;
        getMessages();
    }

    const sendMessage = async () => {
        let txn = await $contract.sendMessage($currentChannel, sendMsgContent);
        sendMsgContent = "";
        await txn.wait();

        getMessages();
    }

    const deleteMessage = async (msgId) => {
        let txn = await $contract.deleteMessage($currentChannel, msgId);
        await txn.wait();
        getMessages();
    }

    onMount(() => {
        getChannels();
        getMessages();
    })

    $contract.on("ChannelCreated", () => {
        getChannels();
    });

    $contract.on("ChannelDeleted", () => {
        getChannels();
    })

    $contract.on("MessageSent", () => {
        getMessages();
    })

    $contract.on("MessageDeleted", () => {
        getMessages();
    })

    let newChName;
    let sendMsgContent;

    $: channelName = $channels.filter(ch => ch.id == $currentChannel)[0]?.name;

</script>

<main id="container">
    <aside>
        <div class="channel-header">Channels:</div>
        <div class="channels">
        <ul>
            {#each $channels as channel}
                <li>
                    <span class="ch-name" on:click={changeChannel(channel.id)}>{channel.name}</span>
                    <div class="ch-delete" on:click={deleteChannel(channel.id)}>X</div>
                </li>
            {/each}
        </ul>
        </div>
        <div class="ch-input">
            <input type="text" placeholder="Create channel" maxlength=18 bind:value={newChName} on:keypress={ev => {
                if (ev.code == "Enter") createChannel();
            }}/>
        </div>
        
    </aside>
    <section>
        <div class="chat-header">{channelName ? channelName : "<- Create a channel"}</div>
        <div class="chat-messages">
            {#each $messages as message}
            <div class="message">
                <div class="message-content">
                    <div class="header">
                        <p class="author">{message.author}</p>
                        <p class="date">{message.timestamp}</p>
                    </div>
                    <p>{message.content}</p>
                </div>
                <div class="message-delete" on:click={deleteMessage(message.id)}>X</div>
            </div>
            {/each}
        </div>
        <div class="msg-input">
            <input type="text" disabled={$channels.length === 0} placeholder={$channels.length === 0 ? "<- Create a channel first" : "Send message"} maxlength=151 on:keypress={ev => {
                if (ev.code == "Enter") sendMessage();
            }} bind:value={sendMsgContent} />
        </div>
    </section>
</main>

<style>
    #container {
        display: flex;
        height: 100%;
    }

    aside {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 20px 20px 20px;
        flex-basis: 15%;

        background: #2f3136;
        
    }

    .channels {
        flex-basis: 100%;
    }

    li {
        display: flex;
        justify-content: space-between;
        margin-right: 10px;
        margin-bottom: 10px;
        list-style: none;
        line-height: 40px;
        width: 100%;
        height: 40px;
    }

    span {
        border-radius: 15px 0 0 15px;
        
        height: 100%;
        text-align: center;
        flex-basis: 90%;
    }

    span:hover {
        background: #40444b;
    }

    .ch-delete {
        margin-left: 20px;
        padding: 0 15px 0 15px;
        flex-basis: 10px;
        cursor: pointer;
        border-radius: 0 15px 15px 0;
        
    }

    .ch-delete:hover {
        background-color: red;
    }

    section {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        padding: 0 0 20px 0;
        
    }

    .channel-header {
        margin-bottom: 20px;
        font-weight: bold;
        font-size: 2em;
        padding-top: 10px;
        padding-left: 3px;
    }

    .chat-header {
        background: #2f3136;
        margin-bottom: 20px;
        font-weight: bold;
        font-size: 3em;
        padding-top: 3px;
        padding-left: 3px;
    }

    .chat-messages {
        flex-basis: 100%;
        padding: 20px;
    }

    .ch-input {
        display: flex;
        background: #40444b;
        width: 100%;
        height: 40px;
        justify-content: space-between;
        align-content: center;
        border-radius: 15px 15px 15px 15px;
        
    }

    .msg-input {
        display: flex;
        margin: 10px 10px 0px 10px;
        background: #40444b;
        width: 98%;
        height: 40px;
        justify-content: space-between;
        align-content: center;
        border-radius: 15px 15px 15px 15px;
    }

    .ch-input input {
        width: 100%;
        background: #40444b;
        border-color: #40444b;
        color: #FFF;
        border-radius: 15px 15px 15px 15px;
        height: 100%;
    }

    .msg-input input {
        width: 100%;
        background: #40444b;
        border-color: #40444b;
        color: #FFF;
        border-radius: 15px 15px 15px 15px;
        height: 100%;
    }

    .message {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .message-content {
        border-radius: 15px 0px 0px 15px;
        
        padding: 10px;
        width: 95%;
    }

    .message-content:hover {
        background: #2f3136;
    }

    .message-content .header {
        display: flex;
        flex-direction: row;
        margin-bottom: 5px;
    }

    .author {
        color: #FFF;
        margin-right: 10px;
    }

    .date {
        color: gray;
    }

    .message-delete {
        margin-left: 20px;
        padding: 0 15px 0 15px;
        width: 1%;
        cursor: pointer;
        padding-top: 20px;
        text-align: center;
        border-radius: 0 15px 15px 0;
        
    }

    .message-delete:hover {
        background-color: red;
    }

</style>
