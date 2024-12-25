function XmasTree2024_2
    fig = figure('Units','normalized', 'Position',[.1,.1,.5,.8],...
        'Color',[0,9,33]/255, 'UserData',40 + [60,65,75,72,0,59,64,57,74,0,63,59,57,0,1,6,45,75,61,74,28,57,76,57,1,1]);
    
    axes('Parent',fig, 'Position',[0,-1/6,1,1+1/3], 'UserData',97 + [18,11,0,13,3,0,17,4,17],...
          'XLim',[-6,6], 'YLim',[-6,6], 'ZLim',[-16, 1], 'DataAspectRatio', [1,1,1], 'NextPlot','add',...
          'Projection','perspective', 'Color',[0,9,33]/255, 'XColor','none', 'YColor','none', 'ZColor','none')

    [X,T] = meshgrid(.4:.1:1, 0:pi/50:2*pi);
    XM = 1 + sin(8.*T).*.05;
    X = X.*XM; R = X.^(3).*(.5 + sin(8.*T).*.02);
    dF = @(R, T, X) surf(R.*cos(T), R.*sin(T), -X, 'EdgeColor',[20,107,58]./255,...
        'FaceColor', [20,107,58]./255, 'FaceAlpha',.2, 'LineWidth',1);
    CList = [254,103,110; 255,191,115; 57,120,164]./255;
    
    for i = 1:5
        tR = R.*(2 + i); tT = T+i; tX = X.*(2 + i) + i;
        SFHdl = dF(tR, tT, tX);
        [~, ind] = sort(SFHdl.ZData(:)); ind = ind(1:8);
        C = CList(randi([1,size(CList,1)], [8,1]), :);
        scatter3(tR(ind).*cos(tT(ind)), tR(ind).*sin(tT(ind)), -tX(ind), 120, 'filled',...
            'CData', C, 'MarkerEdgeColor','none', 'MarkerFaceAlpha',.3)
        scatter3(tR(ind).*cos(tT(ind)), tR(ind).*sin(tT(ind)), -tX(ind), 60, 'filled', 'CData', C)
    end
    
    Rx = @(V, theta) V*[1 0 0; 0 cos(theta) sin(theta); 0 -sin(theta) cos(theta)];
    % Rz = @(V, theta) V*[cos(theta) sin(theta) 0;-sin(theta) cos(theta) 0; 0 0 1];
    w = .3; R = .62; r = .4; T = (1/8:1/8:(2 - 1/8)).'.*pi;
    V8 = [ 0, 0, w;  0, 0,-w;
           1, 0, 0;  0, 1, 0; -1, 0, 0;  0,-1,0;
           R, R, 0; -R, R, 0; -R,-R, 0;  R,-R,0;
           cos(T).*r, sin(T).*r, T.*0];
    F8 = [1,3,25; 1,3,11; 2,3,25; 2,3,11; 1,7,11; 1,7,13; 2,7,11; 2,7,13;
          1,4,13; 1,4,15; 2,4,13; 2,4,15; 1,8,15; 1,8,17; 2,8,15; 2,8,17;
          1,5,17; 1,5,19; 2,5,17; 2,5,19; 1,9,19; 1,9,21; 2,9,19; 2,9,21;
          1,6,21; 1,6,23; 2,6,21; 2,6,23; 1,10,23; 1,10,25; 2,10,23; 2,10,25];
    V8 = Rx(V8.*.8, pi/2) + [0,0,-1.3];
    
    patch('Faces',F8, 'Vertices',V8, 'FaceColor',[255,223,153]./255,...
          'EdgeColor',[255,223,153]./255,'FaceAlpha',.2)
    view(3,30)
    
    annotation(fig,'textbox',[0,.05,1,.09], 'Color',[1 1 1], 'String','Merry Christmas XXX',...
        'HorizontalAlignment','center', 'FontWeight','bold', 'FontSize',48,...
        'FontName','华文宋体', 'FontAngle','italic', 'FitBoxToText','off','EdgeColor','none');

    sXYZ = rand(200,3).*[12,12,17] - [6,6,16];
    sHdl1 = plot3(sXYZ(1:90,1),sXYZ(1:90,2),sXYZ(1:90,3), '*', 'Color',[.8,.8,.8]);
    sHdl2 = plot3(sXYZ(91:200,1),sXYZ(91:200,2),sXYZ(91:200,3), '.', 'Color',[.6,.6,.6]);
    
    for i=1:1e8
        sXYZ(:,3) = sXYZ(:,3) - [.1.*ones(90,1); .12.*ones(110,1)];
        sXYZ(sXYZ(:,3)<-16, 3) = sXYZ(sXYZ(:,3) < -16, 3) + 17.5;
        sHdl1.ZData = sXYZ(1:90,3); sHdl2.ZData = sXYZ(91:200,3);
        view([i,30]); drawnow; pause(.05)
    end
end 