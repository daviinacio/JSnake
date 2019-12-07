export default function AssetsLoader(path, resolution, enabled){
    var element = document.getElementById('img_assets');

    if(!element){
        element = document.createElement('div');
        element.id = 'img_assets';
        element.style.display = 'none';

        document.body.append(element);
    }

    function load(skin){
        const assets = {
            head: [],
            body: [],
            corner: [],
            food: []
        };

        // Create element assets
        assets.head.push(createImg('head_up', skin));
        assets.head.push(createImg('head_down', skin));
        assets.head.push(createImg('head_left', skin));
        assets.head.push(createImg('head_right', skin));

        assets.body.push(createImg('body_up', skin));
        assets.body.push(createImg('body_down', skin));
        assets.body.push(createImg('body_left', skin));
        assets.body.push(createImg('body_right', skin));

        assets.corner[0] = [];
        assets.corner[0][2] = createImg('corner_up_left', skin);
        assets.corner[0][3] = createImg('corner_up_right', skin);

        assets.corner[1] = [];
        assets.corner[1][2] = createImg('corner_down_left', skin);
        assets.corner[1][3] = createImg('corner_down_right', skin);

        assets.corner[2] = [];
        assets.corner[2][0] = createImg('corner_left_up', skin);
        assets.corner[2][1] = createImg('corner_left_down', skin);

        assets.corner[3] = [];
        assets.corner[3][0] = createImg('corner_right_up', skin);
        assets.corner[3][1] = createImg('corner_right_down', skin);

        assets.food.push(createImg('food_2', skin));

        // Insert elements on DOM
        assets.head.forEach(function(head){
            element.append(head);
        });

        assets.body.forEach(function(body){
            element.append(body);
        });

        assets.corner.forEach(function(cornerX){
            cornerX.forEach(function(corner){
                element.append(corner);
            });
        });

        assets.food.forEach(function(food){
            element.append(food);
        });

        return assets;
    }

    function createImg(asset, skin){
        var img = document.createElement('img');
        img.src = path + '/' + skin +'/' + asset + '.png';
        return img;
    }

    return {
        load
    };
}