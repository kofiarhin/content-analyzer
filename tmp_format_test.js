const { formatToProperJson } = require('./server/utils/formatToProperJson');
const raw = '{\n  "summary": "The DevKofi channel focuses on software development, particularly web development using technologies like MERN (MongoDB, Express, React, Node.js), JavaScript, and React. The channel provides tutorials, crash courses, and tips on mastering these technologies. DevKofi\'s content is geared towards beginners and intermediate developers looking to improve their coding skills.",\n  "top_videos": [\n    "Build a Fullstack Chat App with MERN and Socket.IO",\n    "React Crash Course for Beginners (2024)"\n  ],\n  "engagement_insights": "Shorter videos (less than 2 hours) tend to perform better, with \'React Crash Course for Beginners (2024)\' being notable exceptions. However, \nthis line break should be fixed.",\n  "suggested_topics": [\n    {\n      "title": "Optimizing React App Performance with Code Splitting",\n      "description": "In this video, DevKofi will show viewers how to optimize React app performance with code splitting. \nThis topic fits the channel\'s niche."\n    },\n  ],\n}';
try {
  const obj = formatToProperJson(raw);
  console.log('OK', Object.keys(obj));
  console.log(obj.suggested_topics[0].description);
} catch (e) {
  console.error('ERR', e.message);
}
