import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({
    profile: {
        bio,
        skills,
        user: { name },
    },
}) => {
    return (
        <div class="profile-about bg-light p-2">
            {bio && (
                <Fragment>
                    <h2 class="text-primary">
                        {name.trim().split(" ")[0]}'s Bio
                    </h2>
                    <p>{bio}</p>
                    <div class="line"></div>
                </Fragment>
            )}
            <h2 class="text-primary">Skill Set</h2>
            <div class="skills">
                {skills && skills.length > 0 ? (
                    skills.map((skill, index) => (
                        <li key={index} className="text-primary">
                            <i className="fas fa-check"></i> {skill}
                        </li>
                    ))
                ) : (
                    <li className="text-muted">No skills listed</li>
                )}
            </div>
        </div>
    );
};

ProfileAbout.propTypes = {
    profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
