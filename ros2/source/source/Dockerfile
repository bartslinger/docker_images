# This is an auto generated Dockerfile for ros2:source
# generated from docker_images_ros2/source/create_ros_image.Dockerfile.em

ARG FROM_IMAGE=osrf/ros2:devel
#FROM $FROM_IMAGE
FROM ubuntu:jammy-20220301 as build

# setup timezone
RUN echo 'Etc/UTC' > /etc/timezone && \
    ln -s /usr/share/zoneinfo/Etc/UTC /etc/localtime && \
    apt-get update && \
    apt-get install -q -y --no-install-recommends tzdata && \
    rm -rf /var/lib/apt/lists/*

# install packages
RUN apt-get update && apt-get install -q -y --no-install-recommends \
    bash-completion \
    dirmngr \
    gnupg2 \
    lsb-release \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# setup sources.list
RUN echo "deb http://packages.ros.org/ros2/ubuntu jammy main" > /etc/apt/sources.list.d/ros2-latest.list

# setup keys
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654

# setup environment
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

# install bootstrap tools
RUN apt-get update && apt-get install --no-install-recommends -y \
    build-essential \
    git \
    python3-colcon-common-extensions \
    python3-colcon-mixin \
    python3-rosdep \
    python3-vcstool \
    && rm -rf /var/lib/apt/lists/*

# install python packages
RUN pip3 install -U \
    argcomplete \
    flake8 \
    flake8-blind-except \
    flake8-builtins \
    flake8-class-newline \
    flake8-comprehensions \
    flake8-deprecated \
    flake8-docstrings \
    flake8-import-order \
    flake8-quotes \
    pytest-repeat \
    pytest-rerunfailures
# This is a workaround for pytest not found causing builds to fail
# Following RUN statements tests for regression of https://github.com/ros2/ros2/issues/722
RUN pip3 freeze | grep pytest \
    && python3 -m pytest --version

# bootstrap rosdep
RUN rosdep init \
    && rosdep update

# setup colcon mixin and metadata
RUN colcon mixin add default \
      https://raw.githubusercontent.com/colcon/colcon-mixin-repository/master/index.yaml && \
    colcon mixin update && \
    colcon metadata add default \
      https://raw.githubusercontent.com/colcon/colcon-metadata-repository/master/index.yaml && \
    colcon metadata update

# clone source
ENV ROS2_WS /opt/ros2_ws
RUN mkdir -p $ROS2_WS/src
WORKDIR $ROS2_WS

# build source
RUN colcon \
    build \
    --cmake-args \
      -DSECURITY=ON --no-warn-unused-cli
    #--symlink-install

# setup bashrc
RUN cp /etc/skel/.bashrc ~/

# setup entrypoint
COPY ./ros_entrypoint.sh /

# install packages
RUN apt-get update && apt-get install -q -y --no-install-recommends \
    libasio-dev \
    libssl-dev \
    libtinyxml2-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*
ARG ROS_DISTRO=humble
ENV ROS_DISTRO=$ROS_DISTRO
ENV ROS_VERSION=2 \
    ROS_PYTHON_VERSION=3

WORKDIR $ROS2_WS

#RUN wget https://raw.githubusercontent.com/ros2/ros2/$ROS_DISTRO-release/ros2.repos \
#    && vcs import src < ros2.repos
COPY humble-ros-core.repos ./
RUN vcs import src < humble-ros-core.repos

# install dependencies
RUN apt-get update && rosdep install -y \
    --from-paths src \
    --ignore-src \
    --skip-keys " \
        console_bridge \
        fastcdr \
        fastrtps \
        libopensplice69 \
        rti-connext-dds-6.0.1 \
        urdfdom_headers" \
    && rm -rf /var/lib/apt/lists/*

# build source
RUN colcon \
    build \
    --mixin build-testing-on release \
    --cmake-args --no-warn-unused-cli
    #--symlink-install \

ARG RUN_TESTS
ARG FAIL_ON_TEST_FAILURE
RUN if [ ! -z "$RUN_TESTS" ]; then \
        colcon test; \
        if [ ! -z "$FAIL_ON_TEST_FAILURE" ]; then \
            colcon test-result; \
        else \
            colcon test-result || true; \
        fi \
    fi













FROM ubuntu:jammy-20220301

# setup timezone
RUN echo 'Etc/UTC' > /etc/timezone && \
    ln -s /usr/share/zoneinfo/Etc/UTC /etc/localtime && \
    apt-get update && \
    apt-get install -q -y --no-install-recommends tzdata && \
    rm -rf /var/lib/apt/lists/*

# install packages
RUN apt-get update && apt-get install -q -y --no-install-recommends \
    bash-completion \
    dirmngr \
    gnupg2 \
    lsb-release \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# setup sources.list
RUN echo "deb http://packages.ros.org/ros2/ubuntu jammy main" > /etc/apt/sources.list.d/ros2-latest.list

# setup keys
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654

# setup environment
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

# install bootstrap tools
RUN apt-get update && apt-get install --no-install-recommends -y \
    build-essential \
    python3-rosdep

# bootstrap rosdep
RUN rosdep init \
    && rosdep update

ENV ROS2_WS /opt/ros2_ws
WORKDIR $ROS2_WS
COPY --from=build /opt/ros2_ws/install ./install

# install packages
RUN apt-get update && apt-get install -q -y --no-install-recommends \
    libasio-dev \
    libssl-dev \
    libtinyxml2-dev \
    wget

ARG ROS_DISTRO=humble
ENV ROS_DISTRO=$ROS_DISTRO
ENV ROS_VERSION=2 \
    ROS_PYTHON_VERSION=3

# install dependencies
RUN apt-get update && rosdep install -y \
    -t exec \
    --from-paths install/** \
    --ignore-src \
    --skip-keys " \
        console_bridge \
        fastcdr \
        fastrtps \
        libopensplice69 \
        rti-connext-dds-6.0.1 \
        cyclonedds \
        iceoryx_binding_c \
        urdfdom_headers" \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -q -y --no-install-recommends \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN bash -c 'source $HOME/.nvm/nvm.sh   && \
	nvm install 14.17.6'

RUN ln -s /opt/ros2_ws/install /a

WORKDIR /root/node_proj

RUN echo export AMENT_PREFIX_PATH=/a/ros_core:/a/common_interfaces:/a/visualization_msgs:/a/test_msgs:/a/sros2_cmake:/a/ros2cli_common_extensions:/a/sros2:/a/ros_testing:/a/ros2topic:/a/ros2test:/a/ros2component:/a/ros2param:/a/ros2lifecycle:/a/ros2service:/a/ros2run:/a/ros2launch:/a/ros2pkg:/a/ros2node:/a/ros2multicast:/a/ros2interface:/a/ros2doctor:/a/ros2cli_test_interfaces:/a/ros2action:/a/ros2cli:/a/launch_testing_ros:/a/launch_ros:/a/rclpy:/a/rclcpp_action:/a/rcl_action:/a/action_msgs:/a/unique_identifier_msgs:/a/ament_lint_common:/a/ament_cmake_uncrustify:/a/ament_uncrustify:/a/uncrustify_vendor:/a/trajectory_msgs:/a/ros2lifecycle_test_fixtures:/a/rclcpp_lifecycle:/a/rclcpp_components:/a/rclcpp:/a/rcl_lifecycle:/a/libstatistics_collector:/a/rcl:/a/rmw_implementation:/a/rmw_fastrtps_dynamic_cpp:/a/rmw_fastrtps_cpp:/a/rmw_fastrtps_shared_cpp:/a/rmw_cyclonedds_cpp:/a/tracetools:/a/pluginlib:/a/tinyxml2_vendor:/a/test_interface_files:/a/stereo_msgs:/a/std_srvs:/a/shape_msgs:/a/sensor_msgs:/a/nav_msgs:/a/diagnostic_msgs:/a/geometry_msgs:/a/actionlib_msgs:/a/std_msgs:/a/statistics_msgs:/a/rcl_logging_spdlog:/a/spdlog_vendor:/a/rmw_connextdds:/a/rmw_connextdds_common:/a/rti_connext_dds_cmake_module:/a/rosgraph_msgs:/a/rmw_dds_common:/a/composition_interfaces:/a/rcl_interfaces:/a/lifecycle_msgs:/a/builtin_interfaces:/a/rosidl_default_runtime:/a/rosidl_default_generators:/a/rosidl_generator_py:/a/rpyutils:/a/rosidl_typesupport_cpp:/a/rosidl_typesupport_introspection_cpp:/a/rosidl_typesupport_c:/a/rosidl_typesupport_introspection_c:/a/rosidl_typesupport_fastrtps_c:/a/rosidl_typesupport_fastrtps_cpp:/a/rosidl_generator_cpp:/a/rosidl_runtime_cpp:/a/rcl_yaml_param_parser:/a/rmw:/a/rosidl_runtime_c:/a/rosidl_generator_c:/a/rosidl_typesupport_interface:/a/rosidl_runtime_py:/a/rosidl_cmake:/a/rosidl_parser:/a/rosidl_adapter:/a/rosidl_cli:/a/ros_environment:/a/rmw_implementation_cmake:/a/class_loader:/a/rcpputils:/a/rcl_logging_interface:/a/rcutils:/a/launch_testing_ament_cmake:/a/python_cmake_module:/a/pybind11_vendor:/a/performance_test_fixture:/a/launch_testing:/a/launch_yaml:/a/launch_xml:/a/launch:/a/osrf_pycommon:/a/mimick_vendor:/a/libyaml_vendor:/a/ament_cmake_ros:/a/ament_cmake_gmock:/a/ament_cmake_auto:/a/ament_cmake_gtest:/a/ament_cmake_google_benchmark:/a/fastrtps_cmake_module:/a/domain_coordinator:/a/console_bridge_vendor:/a/ament_cmake_xmllint:/a/ament_xmllint:/a/ament_pycodestyle:/a/ament_cmake_pep257:/a/ament_pep257:/a/ament_lint_auto:/a/ament_cmake:/a/ament_cmake_version:/a/ament_cmake_pytest:/a/ament_cmake_lint_cmake:/a/ament_cmake_flake8:/a/ament_cmake_cpplint:/a/ament_cmake_cppcheck:/a/ament_cmake_copyright:/a/ament_cmake_test:/a/ament_cmake_target_dependencies:/a/ament_cmake_python:/a/ament_cmake_export_dependencies:/a/ament_cmake_libraries:/a/ament_cmake_include_directories:/a/ament_cmake_gen_version_h:/a/ament_cmake_export_targets:/a/ament_cmake_export_link_flags:/a/ament_cmake_export_interfaces:/a/ament_cmake_export_libraries:/a/ament_cmake_export_include_directories:/a/ament_cmake_export_definitions:/a/ament_cmake_core:/a/ament_package:/a/ament_mypy:/a/ament_lint_cmake:/a/ament_flake8:/a/ament_copyright:/a/ament_lint:/a/ament_index_python:/a/ament_index_cpp:/a/ament_cpplint:/a/ament_cppcheck > ament_prefix_path


COPY index.js ./
COPY package.json ./
RUN bash -c 'source /opt/ros2_ws/install/setup.bash && \
	source $HOME/.nvm/nvm.sh   && \
	source ament_prefix_path && \
	npm install'

# setup entrypoint
COPY ./ros_entrypoint.sh /

ENTRYPOINT ["/ros_entrypoint.sh"]
CMD ["bash"]
