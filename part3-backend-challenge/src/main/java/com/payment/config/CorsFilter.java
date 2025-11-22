package com.payment.config;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Flux;
import java.util.Set;

@Filter("/**")
public class CorsFilter implements HttpServerFilter {
    private static final Set<String> ALLOWED_ORIGINS = Set.of(
            "http://localhost:3000",
            "http://localhost:5173"
    );

    @Override
    public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
        return Flux.from(chain.proceed(request))
            .doOnNext(response -> {
                String origin = request.getHeaders().getOrigin().orElse("http://localhost:3000");
                String allow = ALLOWED_ORIGINS.contains(origin) ? origin : "http://localhost:3000";
                response.header("Access-Control-Allow-Origin", allow);
                response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
                response.header("Access-Control-Allow-Headers", "*");
                response.header("Access-Control-Expose-Headers", "*");
                response.header("Access-Control-Allow-Credentials", "true");
                response.header("Access-Control-Max-Age", "3600");
            });
    }
}
