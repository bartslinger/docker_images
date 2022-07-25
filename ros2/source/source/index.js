const rclnodejs = require('rclnodejs');
console.log('hello, world');

rclnodejs.init().then(() => {
	const node = rclnodejs.createNode('subscription_example_node');

	node.createSubscription('std_msgs/msg/String', 'chatter', (msg) => {
		console.log(msg);
	});

	rclnodejs.spin(node);
});

