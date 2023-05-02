export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser?._id ? users[1] : users[0];
};

export const sameSender = (messages, m, i, user) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id === undefined ||
      messages[i + 1].sender._id !== m.sender._id) &&
    messages[i].sender._id !== user._id
  );
};

export const lastMessage = (messages, m, i, user) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== user._id &&
    messages[messages.length - 1].sender._id
  );
};

export const isSenderMargin = (messages, m, i, user) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== user._id
  ) {
    return 33;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== user._id) ||
    (i === messages.length - 1 && messages[i].sender._id !== user._id)
  ) {
    return 0;
  } else {
    return "auto";
  }
};

export const isSameUser = (messages, m, i, user) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
