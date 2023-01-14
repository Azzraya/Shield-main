// member2 default is the client member
function isRoleRankHigher(member, member2 = null) {
  let client = member.client;
  member2 ??= member.guild.members.cache.get(client.user.id);
  let roleRank = getRoleRank(member);
  let roleRank2 = getRoleRank(member2);
  return roleRank > roleRank2;
}

function getRoleRank(member) {
  let roles = member.roles.cache;
  return Math.max(...roles.map((r) => r.rawPosition));
}

module.exports = {
  getRoleRank,
  isRoleRankHigher,
};
