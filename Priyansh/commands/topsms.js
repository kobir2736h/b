module.exports.config = {
  name: "top",
  version: "0.0.5",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐯𝐩𝐮𝐭",
  description: "Top Server!",
  commandCategory: "group",
  usages: "[thread]",
  cooldowns: 5
};

module.exports.run = async ({ event, api, args }) => {
  const { threadID, messageID } = event;

  // limit চেক
  if (args[1] && (isNaN(args[1]) || parseInt(args[1]) <= 0)) {
    return api.sendMessage("List length must be a positive number", threadID, messageID);
  }
  const option = parseInt(args[1]) || 10;

  // top thread লিস্ট পেতে চেষ্টা
  let data, msg = "";
  try {
    data = await api.getThreadList(option + 10, null, ["INBOX"]);
  } catch (e) {
    console.log(e);
    return api.sendMessage("Error fetching thread list", threadID, messageID);
  }

  // গ্রুপগুলো ফিল্টার করা
  let threadList = [];
  for (const thread of data) {
    if (thread.isGroup) {
      threadList.push({
        threadName: thread.name || "No name",
        threadID: thread.threadID,
        messageCount: thread.messageCount
      });
    }
  }

  // messageCount অনুযায়ী sorting (descending)
  threadList.sort((a, b) => b.messageCount - a.messageCount);

  // লিস্ট ফরম্যাট করা
  for (let i = 0; i < Math.min(option, threadList.length); i++) {
    let t = threadList[i];
    msg += `${i + 1}/ ${t.threadName}\nTID: [${t.threadID}]\nNumber of messages: ${t.messageCount} messages\n\n`;
  }

  // মেসেজ পাঠানো
  return api.sendMessage(
    `Top ${Math.min(option, threadList.length)} Groups With Most Messages:\n_____________________________\n${msg}_____________________________`,
    threadID,
    messageID
  );
};
