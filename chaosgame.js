$(document).ready(function() {
    var canvasAspectRatio = 4/3;//2 / Math.sqrt(3);

    var speed = null;

    var canvas = $('#canvas').get(0);
    var canvasCtx = canvas.getContext('2d');

    var width = null;
    var height = null;

    var centerX = null;
    var centerY = null;

    var pts = null;

    var fromPoint = null;

    function widthToHeight(width) {
        return width * Math.sqrt(3) / 2;
    }
    function heightToWidth(height) {
        return height * 2 / Math.sqrt(3);
    }

    function initSize() {
        var calcWidth = $('#content').width();
        var calcHeight = $('html').height() - $('#toolbar-row').height();

        /* Padding. */
        calcWidth = calcWidth;
        calcHeight = calcHeight - 50;

        /* Fix aspect ratio. */
        if (calcWidth / canvasAspectRatio > calcHeight) {
            calcWidth = calcHeight * canvasAspectRatio;
        } else if (calcHeight * canvasAspectRatio > calcWidth) {
            calcHeight = calcWidth / canvasAspectRatio;
        }

        /* Set canvas size. */
        $('#canvas').width(calcWidth);
        $('#canvas').height(calcHeight);
    }

    function initPoints() {
        width = $(canvas).width();
        height = $(canvas).height();
        canvas.width = width;
        canvas.height = height;

        if (widthToHeight(width) > height) {
            width = heightToWidth(height);
        } else if (heightToWidth(height) > width) {
            height = widthToHeight(width);
        }

        centerX = canvas.width / 2;
        centerY = canvas.height / 2;

        pts = [
            { x: centerX, y: centerY - height / 2 },
            { x: centerX - width / 2, y: centerY + height / 2 },
            { x: centerX + width / 2, y: centerY + height / 2 }
        ]
    }

    function randomPoint() {
        /*
         * We are going to pretend that we have two triangles
         * side-by-side, so that they form a square with the
         * given width and height.
         */

        /* Ping a point in the square. */
        var x = Math.random() * width;
        var y = Math.random() * height;

        /* Now, check if the point is in the rightmost triangle. */
        if (x/width > y/height) {
            /*
             * It is in the rightmost triangle. Then let us rotate
             * the point 180 degrees, so that it falls in the leftmost
             * triangle.
             */
            x = width - x;
            y = height - y;
        }

        /* Now we are left with points in a right isosceles triangle.
         * Transform to a point in a equilateral triangle.
         */
        x += (width / 2) * (height - y) / height;

        x = centerX - width/2 + x;
        y = centerY - height/2 + y;

        return { 'x': x, 'y': y };
    }

    function start() {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        initSize();
        initPoints();
        fromPoint = randomPoint();
    }

    function doPoints(count) {
        for (var i = 0; i < count; i++) {
            var targetPoint = pts[Math.floor(Math.random() * 3)];
            var pt = {
                'x': fromPoint.x + (targetPoint.x - fromPoint.x) / 2,
                'y': fromPoint.y + (targetPoint.y - fromPoint.y) / 2
            }
            canvasCtx.fillRect(Math.floor(pt.x), Math.floor(pt.y), 1, 1);
            fromPoint = pt;
        }
    }

    start();

    $(window).resize(initSize);
    window.setInterval(function() {
        doPoints(speed);
    }, 100);

    $('#reset').click(function() {
        start();
    });

    $('.speed-button').click(function() {
        var self = $(this);
        speed = self.data('speed') + 0;
        self.addClass("btn-primary").removeClass('btn-default');
        self.siblings().addClass('btn-default').removeClass("btn-primary");
    });

    $('#speed-default').click();
});
