// Generated by CoffeeScript 1.9.1
(function() {
  this.FlowTip = (function() {
    FlowTip.prototype.FlowTip = "3.0";

    FlowTip.prototype.className = "";

    FlowTip.prototype.contentClassName = "";

    FlowTip.prototype.tailClassName = "";

    FlowTip.prototype.appendTo = null;

    FlowTip.prototype.tooltipContent = null;

    FlowTip.prototype.region = "top";

    FlowTip.prototype.topDisabled = false;

    FlowTip.prototype.bottomDisabled = false;

    FlowTip.prototype.leftDisabled = false;

    FlowTip.prototype.rightDisabled = false;

    FlowTip.prototype.hideInDisabledRegions = false;

    FlowTip.prototype.persevere = false;

    FlowTip.prototype.hasTail = true;

    FlowTip.prototype.width = null;

    FlowTip.prototype.height = "auto";

    FlowTip.prototype.minWidth = null;

    FlowTip.prototype.minHeight = null;

    FlowTip.prototype.maxWidth = null;

    FlowTip.prototype.maxHeight = null;

    FlowTip.prototype.tailWidth = 20;

    FlowTip.prototype.tailHeight = 10;

    FlowTip.prototype.targetOffset = 10;

    FlowTip.prototype.targetOffsetFrom = "root";

    FlowTip.prototype.edgeOffset = 30;

    FlowTip.prototype.rotationOffset = 30;

    FlowTip.prototype.targetAlign = "center";

    FlowTip.prototype.targetAlignOffset = 0;

    FlowTip.prototype.rootAlign = "center";

    FlowTip.prototype.rootAlignOffset = 0;

    function FlowTip(options) {
      var option;
      if (options == null) {
        options = {};
      }
      this.visible = false;
      this.target = null;
      for (option in options) {
        if (_.has(options, option) && options[option] !== void 0) {
          this[option] = options[option];
        }
      }
      this.coordinator = new FlowTip.Coordinator();
    }

    FlowTip.prototype.render = function() {
      if (this.$root) {
        return this._renderContent();
      }
      this.root = document.createElement("div");
      this.root.className = "flowtip " + this.className;
      this.root.style.position = "absolute";
      this.root.style.display = "none";
      this.content = document.createElement("div");
      this.content.className = "flowtip-content " + this.contentClassName;
      this._renderContent();
      this._repositionCount = 0;
      this.root.appendChild(this.content);
      this.tail = document.createElement("div");
      this.tail.className = "flowtip-tail " + this.tailClassName;
      this.tail.style.position = "absolute";
      this.tail.appendChild(document.createElement("div"));
      this.root.appendChild(this.tail);
      this.$root = $(this.root);
      this.$content = $(this.content);
      this.$tail = $(this.tail);
      this.$appendTo = $(this.appendTo || (this.appendTo = document.body));
      this.appendTo = this.$appendTo[0];
      return this._insertToDOM();
    };

    FlowTip.prototype.setAppendTo = function(appendTo) {
      this.$appendTo = $(appendTo);
      this.appendTo = this.$appendTo[0];
      if (this.$root) {
        return this._insertToDOM();
      }
    };

    FlowTip.prototype.setTarget = function(target) {
      this.$target = $(target);
      this.target = this.$target[0];
      return this.clientRect = false;
    };

    FlowTip.prototype.setClientRectTarget = function(rect) {
      this.target = rect;
      this.$target = null;
      return this.clientRect = true;
    };

    FlowTip.prototype.setTooltipContent = function(content, options) {
      if (options == null) {
        options = {};
      }
      this.tooltipContent = content;
      if (options.render) {
        return this.render();
      }
    };

    FlowTip.prototype.reposition = function(options) {
      if (options == null) {
        options = {};
      }
      if (!this.target) {
        return;
      }
      this._updateDimensions();
      return this._updatePosition(options);
    };

    FlowTip.prototype.show = function() {
      if (this.visible) {
        return;
      }
      this.render();
      this.visible = true;
      this._updateVisibility(false);
      this.root.style.display = "block";
      return _.delay((function(_this) {
        return function() {
          _this.reposition();
          return _this.trigger("show");
        };
      })(this), 16);
    };

    FlowTip.prototype.hide = function() {
      if (!this.visible) {
        return;
      }
      this.visible = false;
      this.root.style.display = "none";
      return this.trigger("hide");
    };

    FlowTip.prototype.trigger = function(eventName) {
      return this.$root.trigger(eventName + ".flowtip");
    };

    FlowTip.prototype.destroy = function() {
      if (this.$root) {
        return this.$root.remove();
      }
    };

    FlowTip.prototype.setClientRect = function(rect) {
      return this.setClientRectTarget(rect);
    };

    FlowTip.prototype._updateCoordinator = function() {
      this.coordinator.tooltipOptions = _.reduce(FlowTip.Coordinator.TooltipOptions, (function(_this) {
        return function(opts, opt) {
          opts[opt] = _this[opt];
          return opts;
        };
      })(this), {});
      this.coordinator.$tooltipRoot = this.$root;
      this.coordinator.$tooltipTail = this.$tail;
      this.coordinator.$tooltipParent = this.$appendTo;
      this.coordinator.tooltipTargetType = this.clientRect ? "rect" : "element";
      this.coordinator.tooltipTarget = this.target;
      return this.coordinator.$tooltipTarget = this.$target;
    };

    FlowTip.prototype._updateDimensions = function() {
      this.$root.width(this.width);
      this.$root.height(this.height);
      this.$root.css({
        minWidth: this.minWidth,
        minHeight: this.minHeight,
        maxWidth: this.maxWidth,
        maxHeight: this.maxHeight
      });
      this.$tail.width(this.tailWidth);
      this.$tail.height(this.tailHeight);
      if (this.width === "auto" || this.height === "auto") {
        return this.content.style.position = "relative";
      }
    };

    FlowTip.prototype._updateVisibility = function(visible) {
      return this.root.style.opacity = visible ? 1 : 0;
    };

    FlowTip.prototype._updatePosition = function(options) {
      var contentHeight, contentOuterHeight, contentSpacing, hadPriorValue, inSameRegion, leftTransform, position, prefix, previousRegion, rootHeight, topTransform;
      if (options == null) {
        options = {};
      }
      previousRegion = this.coordinator.currentRegion();
      this._updateCoordinator();
      position = this.coordinator.calculatePosition();
      inSameRegion = previousRegion === this.coordinator.currentRegion();
      hadPriorValue = this.root.style.top || this.root.style.left;
      options.animate = options.animate && this.visible && inSameRegion && hadPriorValue;
      if (typeof Modernizr !== "undefined") {
        this.root.style[Modernizr.prefixed("transition")] = "none";
      }
      if (options.animate && typeof Modernizr !== "undefined") {
        topTransform = parseInt(this.root.style.top.replace("px", ""), 10) - position.top;
        leftTransform = parseInt(this.root.style.left.replace("px", ""), 10) - position.left;
        this.root.style[Modernizr.prefixed("transform")] = "translate3d(" + leftTransform + "px, " + topTransform + "px, 0)";
      }
      this.root.style.top = position.top + "px";
      this.root.style.left = position.left + "px";
      rootHeight = this.$root.height();
      contentHeight = this.$content.height();
      contentOuterHeight = this.$content.outerHeight(true);
      contentSpacing = contentOuterHeight - contentHeight;
      if (contentOuterHeight > rootHeight) {
        this.content.style.maxHeight = (rootHeight - contentSpacing) + "px";
        this.$root.addClass("content-overflow");
      }
      if (this.hasTail) {
        this.tail.style.display = "block";
        this.tail.style.top = (Math.round(position.tail.top)) + "px";
        this.tail.style.left = (Math.round(position.tail.left)) + "px";
        this.tail.style.width = position.tail.width + "px";
        this.tail.style.height = position.tail.height + "px";
        this.tail.className = "flowtip-tail " + this.tailClassName + " " + position.tail.type;
        this.root.className = this.root.className.replace(/tail-at-[\w]+/, "").trim();
        this.root.className = this.root.className + " tail-at-" + position.tail.type;
      } else {
        this.tail.style.display = "none";
      }
      this._updateVisibility(!position.hidden);
      if (options.animate && typeof Modernizr !== "undefined") {
        prefix = Modernizr.prefixed("transform").replace("Transform", "").toLowerCase();
        if (prefix) {
          prefix = "-" + prefix + "-";
        }
        this.root.style[Modernizr.prefixed("transition")] = prefix + "transform " + (options.animationDuration || "100ms") + " linear";
        return this.root.style[Modernizr.prefixed("transform")] = "translate3d(0, 0, 0)";
      }
    };

    FlowTip.prototype._insertToDOM = function() {
      var position;
      position = this.$appendTo.css("position");
      if (position !== "relative" && position !== "absolute" && position !== "fixed") {
        position = "relative";
      }
      this.appendTo.style.position = position;
      return this.appendTo.appendChild(this.root);
    };

    FlowTip.prototype._renderContent = function() {
      var node;
      if (typeof this.tooltipContent === "string") {
        return $(this.content).html(this.tooltipContent);
      } else {
        this.$tooltipContent = $(this.tooltipContent);
        if (this.$tooltipContent.length) {
          node = this.$tooltipContent[0];
          if (this.content.contains(node)) {
            this.content.removeChild(node);
          }
        }
        this.content.innerHTML = "";
        if (node) {
          return this.content.appendChild(node);
        }
      }
    };

    return FlowTip;

  })();

  this.FlowTip.Coordinator = (function() {
    Coordinator.TooltipOptions = ["region", "persevere", "targetOffset", "targetOffsetFrom", "rotationOffset", "edgeOffset", "rootAlign", "rootAlignOffset", "topRootAlignOffset", "bottomRootAlignOffset", "leftRootAlignOffset", "rightRootAlignOffset", "targetAlign", "targetAlignOffset", "topTargetAlignOffset", "bottomTargetAlignOffset", "leftTargetAlignOffset", "rightTargetAlignOffset", "topDisabled", "bottomDisabled", "leftDisabled", "rightDisabled", "hideInDisabledRegions"];

    Coordinator.prototype.tooltipTargetType = "element";

    function Coordinator(options) {
      if (options == null) {
        options = {};
      }
      this.tooltipOptions = _.defaults(options.tooltipOptions || {}, {
        region: "top",
        targetOffset: 10,
        targetOffsetFrom: "root",
        edgeOffset: 30,
        rotationOffset: 30,
        targetAlign: "center",
        targetAlignOffset: 0,
        rootAlign: "center",
        rootAlignOffset: 0
      });
      this.$tooltipRoot = $(options.tooltipRoot);
      this.$tooltipTail = $(options.tooltipTail);
      this.$tooltipParent = $(options.tooltipParent);
      this.tooltipTargetType = options.tooltipTargetType;
      this.tooltipTarget = options.tooltipTarget;
      if (this.tooltipTargetType === "element") {
        this.$tooltipTarget = $(this.tooltipTarget);
      }
    }

    Coordinator.prototype.calculatePosition = function(region) {
      if (!region) {
        this._updateRegion();
      }
      return this._calculatePosition(region || this._region);
    };

    Coordinator.prototype.currentRegion = function() {
      return this._region;
    };

    Coordinator.prototype._rootAlign = function(region) {
      return this.tooltipOptions[region + "RootAlign"] || this.tooltipOptions.rootAlign;
    };

    Coordinator.prototype._rootAlignOffset = function(region) {
      return this.tooltipOptions[region + "RootAlignOffset"] || this.tooltipOptions.rootAlignOffset;
    };

    Coordinator.prototype._targetAlign = function(region) {
      return this.tooltipOptions[region + "TargetAlign"] || this.tooltipOptions.targetAlign;
    };

    Coordinator.prototype._targetAlignOffset = function(region) {
      return this.tooltipOptions[region + "TargetAlignOffset"] || this.tooltipOptions.targetAlignOffset;
    };

    Coordinator.prototype._availableRegion = function(region) {
      return !this.tooltipOptions[region + "Disabled"];
    };

    Coordinator.prototype._fitsInRegion = function(region) {
      var parentParameter, position, rootDimension;
      position = this._calculatePosition(region);
      rootDimension = this._rootDimension();
      parentParameter = this._parentParameter();
      switch (region) {
        case "top":
          return position.top - this.tooltipOptions.edgeOffset >= 0;
        case "bottom":
          return position.top + rootDimension.height + this.tooltipOptions.edgeOffset <= parentParameter.height;
        case "left":
          return position.left - this.tooltipOptions.edgeOffset >= 0;
        case "right":
          return position.left + rootDimension.width + this.tooltipOptions.edgeOffset <= parentParameter.width;
      }
    };

    Coordinator.prototype._availableAndFitsIn = function(regions, regionParameter, _first) {
      var region;
      _first || (_first = regions[0]);
      region = regions[0];
      if (!regions || regions.length <= 0) {
        if (this.tooltipOptions.hideInDisabledRegions) {
          return _first;
        } else {
          return this._region;
        }
      }
      if (regionParameter[region].availables && regionParameter[region].fits) {
        return region;
      } else {
        return this._availableAndFitsIn(regions.slice(1), regionParameter, _first);
      }
    };

    Coordinator.prototype._rootDimension = function() {
      return {
        width: this.$tooltipRoot.width(),
        height: this.$tooltipRoot.height()
      };
    };

    Coordinator.prototype._tailDimension = function(region) {
      var dimension;
      if (!this._tailOriginalWidth) {
        this._tailOriginalWidth = this.$tooltipTail.width();
      }
      if (!this._tailOriginalHeight) {
        this._tailOriginalHeight = this.$tooltipTail.height();
      }
      dimension = {
        width: this._tailOriginalWidth,
        height: this._tailOriginalHeight
      };
      if (region === "left" || region === "right") {
        return {
          width: dimension.height,
          height: dimension.width
        };
      } else {
        return dimension;
      }
    };

    Coordinator.prototype._tailType = function(region) {
      switch (region) {
        case "top":
          return "bottom";
        case "bottom":
          return "top";
        case "left":
          return "right";
        case "right":
          return "left";
      }
    };

    Coordinator.prototype._parentParameter = function() {
      var parentOffset;
      parentOffset = this.$tooltipParent.offset();
      return {
        top: parentOffset.top,
        left: parentOffset.left,
        height: this.$tooltipParent.outerHeight(),
        width: this.$tooltipParent.outerWidth(),
        scrollTop: this.$tooltipParent.scrollTop(),
        scrollLeft: this.$tooltipParent.scrollLeft()
      };
    };

    Coordinator.prototype._targetParameter = function() {
      var parentOffset, targetOffset;
      parentOffset = this.$tooltipParent.offset();
      if (this.tooltipTargetType === "rect") {
        return {
          top: this.tooltipTarget.top - parentOffset.top,
          left: this.tooltipTarget.left - parentOffset.left,
          height: this.tooltipTarget.bottom - this.tooltipTarget.top,
          width: this.tooltipTarget.right - this.tooltipTarget.left
        };
      } else {
        targetOffset = this.$tooltipTarget.offset();
        return {
          top: targetOffset.top - parentOffset.top,
          left: targetOffset.left - parentOffset.left,
          height: this.$tooltipTarget.outerHeight(),
          width: this.$tooltipTarget.outerWidth()
        };
      }
    };

    Coordinator.prototype._regionParameter = function() {
      return {
        top: {
          fits: this._fitsInRegion("top"),
          availables: this._availableRegion("top")
        },
        bottom: {
          fits: this._fitsInRegion("bottom"),
          availables: this._availableRegion("bottom")
        },
        left: {
          fits: this._fitsInRegion("left"),
          availables: this._availableRegion("left")
        },
        right: {
          fits: this._fitsInRegion("right"),
          availables: this._availableRegion("right")
        }
      };
    };

    Coordinator.prototype._targetAlignmentOffset = function(region) {
      var positive, targetAlign, targetAlignOffset;
      targetAlign = this._targetAlign(region);
      targetAlignOffset = this._targetAlignOffset(region);
      if (targetAlign === "center") {
        if (region === "top" || region === "right") {
          return targetAlignOffset;
        } else if (region === "bottom" || region === "left") {
          return -targetAlignOffset;
        }
      } else if (targetAlign === "edge") {
        positive = targetAlignOffset >= 0;
        if (region === "top" || region === "right") {
          return -targetAlignOffset;
        } else if (region === "bottom" || region === "left") {
          return targetAlignOffset;
        }
      }
    };

    Coordinator.prototype._targetPivot = function(region, targetParameter) {
      var pivot, pivots, positive, targetAlign, targetAlignOffset;
      targetAlign = this._targetAlign(region);
      targetAlignOffset = this._targetAlignOffset(region);
      if (targetAlign === "center") {
        pivot = region === "top" || region === "bottom" ? targetParameter.left + (targetParameter.width / 2) : region === "left" || region === "right" ? targetParameter.top + (targetParameter.height / 2) : void 0;
      } else if (targetAlign === "edge") {
        pivots = region === "top" || region === "bottom" ? [targetParameter.left, targetParameter.left + targetParameter.width] : region === "left" || region === "right" ? [targetParameter.top, targetParameter.top + targetParameter.height] : void 0;
        positive = targetAlignOffset >= 0;
        pivot = region === "top" || region === "right" ? positive ? pivots[1] : pivots[0] : region === "bottom" || region === "left" ? positive ? pivots[0] : pivots[1] : void 0;
      }
      return pivot;
    };

    Coordinator.prototype._tailPivot = function(region, targetParameter, tailDimension, rootPosition) {
      var effectiveOffset, pivot, targetPivot;
      targetPivot = this._targetPivot(region, targetParameter);
      pivot = region === "top" || region === "bottom" ? targetPivot - rootPosition.left - (tailDimension.width / 2) : region === "left" || region === "right" ? targetPivot - rootPosition.top - (tailDimension.height / 2) : void 0;
      effectiveOffset = this._targetAlignmentOffset(region);
      return pivot + effectiveOffset;
    };

    Coordinator.prototype._rootPivot = function(region, targetParameter, rootDimension) {
      var effectiveOffset, pivot, pivots, positive, rootAlign, rootAlignOffset, targetPivot;
      targetPivot = this._targetPivot(region, targetParameter);
      rootAlign = this._rootAlign(region);
      rootAlignOffset = this._rootAlignOffset(region);
      if (rootAlign === "center") {
        pivot = region === "top" || region === "bottom" ? targetPivot - (rootDimension.width / 2) : region === "left" || region === "right" ? targetPivot - (rootDimension.height / 2) : void 0;
        effectiveOffset = region === "top" || region === "right" ? rootAlignOffset : region === "bottom" || region === "left" ? -rootAlignOffset : void 0;
      } else if (rootAlign === "edge") {
        pivots = region === "top" || region === "bottom" ? [targetPivot, targetPivot - rootDimension.width] : region === "left" || region === "right" ? [targetPivot, targetPivot - rootDimension.height] : void 0;
        positive = rootAlignOffset >= 0;
        pivot = region === "top" || region === "right" ? positive ? pivots[1] : pivots[0] : region === "bottom" || region === "left" ? positive ? pivots[0] : pivots[1] : void 0;
        effectiveOffset = region === "top" || region === "right" ? rootAlignOffset : region === "bottom" || region === "left" ? -rootAlignOffset : void 0;
      }
      return pivot + effectiveOffset + this._targetAlignmentOffset(region);
    };

    Coordinator.prototype._calculatePosition = function(region) {
      var effectiveTargetOffset, hasTail, parentParameter, position, rootDimension, tailDimension, tailHeight, tailWidth, targetParameter;
      hasTail = this.$tooltipTail.length > 0;
      rootDimension = this._rootDimension();
      parentParameter = this._parentParameter();
      targetParameter = this._targetParameter();
      tailWidth = 0;
      tailHeight = 0;
      if (hasTail) {
        tailDimension = this._tailDimension(region);
        tailWidth = tailDimension.width;
        tailHeight = tailDimension.height;
      }
      position = {};
      effectiveTargetOffset = this.tooltipOptions.targetOffsetFrom === "root" ? this.tooltipOptions.targetOffset : this.tooltipOptions.targetOffsetFrom === "tail" ? region === "top" || region === "bottom" ? tailHeight + this.tooltipOptions.targetOffset : region === "left" || region === "right" ? tailWidth + this.tooltipOptions.targetOffset : void 0 : void 0;
      switch (region) {
        case "top":
          position = {
            top: targetParameter.top - rootDimension.height - effectiveTargetOffset,
            left: this._rootPivot(region, targetParameter, rootDimension)
          };
          if (hasTail) {
            position.tail = {
              top: rootDimension.height
            };
          }
          break;
        case "bottom":
          position = {
            top: targetParameter.top + targetParameter.height + effectiveTargetOffset,
            left: this._rootPivot(region, targetParameter, rootDimension)
          };
          if (hasTail) {
            position.tail = {
              top: -tailHeight
            };
          }
          break;
        case "left":
          position = {
            top: this._rootPivot(region, targetParameter, rootDimension),
            left: targetParameter.left - rootDimension.width - effectiveTargetOffset
          };
          if (hasTail) {
            position.tail = {
              left: rootDimension.width
            };
          }
          break;
        case "right":
          position = {
            top: this._rootPivot(region, targetParameter, rootDimension),
            left: targetParameter.left + targetParameter.width + effectiveTargetOffset
          };
          if (hasTail) {
            position.tail = {
              left: -tailWidth
            };
          }
      }
      switch (region) {
        case "top":
        case "bottom":
          if (position.left < this.tooltipOptions.edgeOffset) {
            position.left = this.tooltipOptions.edgeOffset;
          } else if (position.left + rootDimension.width > parentParameter.width - this.tooltipOptions.edgeOffset) {
            position.left = parentParameter.width - rootDimension.width - this.tooltipOptions.edgeOffset;
          }
          break;
        case "left":
        case "right":
          if (position.top < this.tooltipOptions.edgeOffset) {
            position.top = this.tooltipOptions.edgeOffset;
          } else if (position.top + rootDimension.height > parentParameter.height - this.tooltipOptions.edgeOffset) {
            position.top = parentParameter.height - rootDimension.height - this.tooltipOptions.edgeOffset;
          }
      }
      if (hasTail) {
        position.tail = (function() {
          switch (region) {
            case "top":
              return {
                top: rootDimension.height,
                left: this._tailPivot(region, targetParameter, tailDimension, position)
              };
            case "bottom":
              return {
                top: -tailHeight,
                left: this._tailPivot(region, targetParameter, tailDimension, position)
              };
            case "left":
              return {
                top: this._tailPivot(region, targetParameter, tailDimension, position),
                left: rootDimension.width
              };
            case "right":
              return {
                top: this._tailPivot(region, targetParameter, tailDimension, position),
                left: -tailWidth
              };
          }
        }).call(this);
        position.tail.top = Math.round(position.tail.top);
        position.tail.left = Math.round(position.tail.left);
        position.tail.width = tailWidth;
        position.tail.height = tailHeight;
        position.tail.type = this._tailType(this._region);
      }
      position.hidden = !this._availableRegion(this._region);
      position.top = Math.round(position.top) + parentParameter.scrollTop;
      position.left = Math.round(position.left) + parentParameter.scrollLeft;
      return position;
    };

    Coordinator.prototype._updateRegion = function(position) {
      var parentParameter, ref, ref1, regionParameter, rotateOptions, targetParameter;
      this._region || (this._region = this.tooltipOptions.region);
      if (this.tooltipOptions.persevere) {
        this._region = this.tooltipOptions.region;
      }
      parentParameter = this._parentParameter();
      targetParameter = this._targetParameter();
      regionParameter = this._regionParameter();
      if (this._region === "top" && !regionParameter.top.fits) {
        this._region = this._availableAndFitsIn(["bottom", "left", "right"], regionParameter);
      } else if (this._region === "bottom" && !regionParameter.bottom.fits) {
        this._region = this._availableAndFitsIn(["top", "left", "right"], regionParameter);
      } else if (this._region === "left" && !regionParameter.left.fits) {
        this._region = this._availableAndFitsIn(["right", "top", "bottom"], regionParameter);
      } else if (this._region === "right" && !regionParameter.right.fits) {
        this._region = this._availableAndFitsIn(["left", "top", "bottom"], regionParameter);
      }
      if (((ref = this._region) === "top" || ref === "bottom") && !regionParameter.top.fits && !regionParameter.bottom.fits) {
        this._region = this._availableAndFitsIn(["left", "right"], regionParameter);
      } else if (((ref1 = this._region) === "left" || ref1 === "right") && !regionParameter.left.fits && !regionParameter.right.fits) {
        this._region = this._availableAndFitsIn(["top", "bottom"], regionParameter);
      }
      rotateOptions = (function() {
        switch (this._region) {
          case "top":
          case "bottom":
            if (parentParameter.width - (targetParameter.left + (targetParameter.width / 2)) - this.tooltipOptions.edgeOffset < this.tooltipOptions.rotationOffset) {
              if (this._region === "top") {
                return ["left", "bottom"];
              } else {
                return ["left", "top"];
              }
            } else if (targetParameter.left + (targetParameter.width / 2) - this.tooltipOptions.edgeOffset < this.tooltipOptions.rotationOffset) {
              if (this._region === "top") {
                return ["right", "bottom"];
              } else {
                return ["right", "top"];
              }
            }
            break;
          case "left":
          case "right":
            if (parentParameter.height - (targetParameter.top + (targetParameter.height / 2)) - this.tooltipOptions.edgeOffset < this.tooltipOptions.rotationOffset) {
              if (this._region === "left") {
                return ["top", "right"];
              } else {
                return ["top", "left"];
              }
            } else if (targetParameter.top + (targetParameter.height / 2) - this.tooltipOptions.edgeOffset < this.tooltipOptions.rotationOffset) {
              if (this._region === "left") {
                return ["bottom", "right"];
              } else {
                return ["bottom", "left"];
              }
            }
        }
      }).call(this);
      if (rotateOptions) {
        return this._region = this._availableAndFitsIn(rotateOptions, regionParameter);
      }
    };

    return Coordinator;

  })();

  this.FlowTip.CoordinatorFactory = {
    GetDefaultInstance: (function(_this) {
      return function() {
        return {
          CreateCoordinator: function(options) {
            if (options == null) {
              options = {};
            }
            return new _this.FlowTip.Coordinator(options);
          }
        };
      };
    })(this)
  };

}).call(this);