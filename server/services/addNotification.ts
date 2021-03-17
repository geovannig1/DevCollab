import { IActivity } from '../models/Activity';

export default (
  activity: IActivity,
  data: any,
  userProject?: (string | undefined)[]
) => {
  return userProject?.map((user, index) => {
    //Add new notification
    if (
      user &&
      (!activity.notifications || !activity.notifications[index]?.user)
    ) {
      if (user.toString() !== data.userId) {
        activity.notifications?.push({
          user: user,
          totalNotifications: 1,
        });
      } else {
        activity.notifications?.push({
          user: user,
          totalNotifications: 0,
        });
      }
    }
    //Update notification that exist
    else if (
      activity.notifications &&
      activity.notifications[index]?.user &&
      user?.toString() !== data.userId
    ) {
      activity.notifications[index].totalNotifications =
        activity.notifications[index].totalNotifications + 1;
    }
    return activity.notifications;
  });
};
