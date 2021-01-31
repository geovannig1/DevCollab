import { IProject, Member } from '../models/Project';
import { IUser } from '../models/User';
import nodemailer from './nodemailer';
import jwt from 'jsonwebtoken';

export default (
  members: Member[],
  user: IUser | null,
  name: string,
  project: IProject
) => {
  members?.map((member: Member) => {
    const payload = {
      member: {
        projectName: name,
        projectId: project.id,
        email: member.email,
        accessPermission: member.accessPermission,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_NODEMAILER_SECRET!);

    let url: string;
    if (process.env.NODE_ENV === 'production') {
      url = `http://<something>/api/projects/invitation/${token}`;
    } else {
      url = `http://localhost:3000/api/projects/invitation/${token}`;
    }

    //Send email
    if (member.email) {
      nodemailer(
        member.email,
        `${name} - Project Invitation`,
        `   
            <div style='font-size: 16px; margin: 0; background: #f5f5f5;padding: 10px 200px;'>
                <div style='height: 180px;background: white; padding: 20px;'>
                <h3 style='color:black;'>Hi ${member.email},</h3>
                <p style='font-size: 15px; color: black; margin:0;'>${user?.email} has invited you to <b>${name}</b> project, <br/>
                click the button below to join the project: </p> 
                <a href="${url}">
                    <button style='background-color: #4463CC;color: white; height: 40px; width: 90px; border: none; margin: 10px 0; cursor: pointer;'>
                    Join
                    </button>
                </a> 
                </div>
            </div>
        `
      );
    }
  });
};
